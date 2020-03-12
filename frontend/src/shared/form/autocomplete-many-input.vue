<template>
  <el-select
    :disabled="disabled"
    :loading="loading"
    :remote-method="handleSearch"
    :value="value"
    @change="onChange"
    clearable
    default-first-option
    filterable
    multiple
    placeholder
    remote
    reserve-keyword
    value-key="id"
  >
    <el-option
      :key="initialOption.id"
      :label="initialOption.label"
      :value="initialOption"
      v-for="initialOption of initialOptions"
    ></el-option>
    <el-option :key="record.id" :label="record.label" :value="record" v-for="record in dataSource"></el-option>
  </el-select>
</template>

<script>
import { debounce, isString } from 'lodash';

const AUTOCOMPLETE_SERVER_FETCH_SIZE = 100;

export default {
  name: 'app-autocomplete-many-input',

  props: {
    value: {
      type: Array,
    },
    fetchFn: {
      type: Function,
    },
    inMemoryFilter: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      loading: false,
      fullDataSource: [],
      serverSideDataSource: [],
      inMemoryDataSource: [],
      currentQuery: 'NOT_INITIALIZED',
      debouncedSearch: () => {},
    };
  },

  mounted() {
    this.debouncedSearch = debounce(
      this.handleSearch.bind(this),
      300,
    );

    // Fetch first results
    this.handleSearch('');
  },

  computed: {
    initialOptions() {
      if (!this.value || !this.value.length) {
        return [];
      }

      return this.value.filter(
        (currentValue) =>
          !this.dataSource
            .map((item) => item.id)
            .includes(currentValue.id),
      );
    },

    dataSource() {
      if (this.inMemoryFilter) {
        return this.inMemoryDataSource;
      }

      return this.serverSideDataSource;
    },
  },

  methods: {
    onChange(value) {
      this.$emit('input', value || []);
    },

    async handleSearch(value) {
      if (!isString(value)) {
        return;
      }

      if (this.inMemoryFilter) {
        return this.handleInMemorySearch(value);
      }

      return this.handleServerSearch(value);
    },

    async handleInMemorySearch(value) {
      if (
        !this.fullDataSource ||
        !this.fullDataSource.length
      ) {
        await this.fetchAllResults();
      }

      this.inMemoryDataSource = this.fullDataSource.filter(
        (item) =>
          String(item.label || '')
            .toLowerCase()
            .includes(String(value || '').toLowerCase()),
      );

      this.loading = false;
    },

    async fetchAllResults() {
      this.loading = true;

      try {
        const fullDataSource = await this.fetchFn();
        this.fullDataSource = fullDataSource;
        this.loading = false;
      } catch (error) {
        console.error(error);
        this.fullDataSource = [];
        this.loading = false;
      }
    },

    async handleServerSearch(value) {
      if (value === this.currentQuery) {
        return;
      }

      this.currentQuery = value;
      this.loading = true;

      try {
        const serverSideDataSource = await this.fetchFn(
          value,
          AUTOCOMPLETE_SERVER_FETCH_SIZE,
        );

        if (this.currentQuery === value) {
          this.serverSideDataSource = serverSideDataSource;
          this.loading = false;
        }
      } catch (error) {
        console.error(error);

        if (this.currentQuery === value) {
          this.serverSideDataSource = [];
          this.loading = false;
        }
      }
    },
  },
};
</script>

<style>
</style>
