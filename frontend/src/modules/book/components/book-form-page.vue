<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">
        <app-i18n code="home.menu"></app-i18n>
      </el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/book' }">
        <app-i18n code="entities.book.menu"></app-i18n>
      </el-breadcrumb-item>
      <el-breadcrumb-item>
        <app-i18n code="entities.book.edit.title" v-if="isEditing"></app-i18n>
        <app-i18n code="entities.book.new.title" v-if="!isEditing"></app-i18n>
      </el-breadcrumb-item>
    </el-breadcrumb>

    <div class="app-content-page">
      <h1 class="app-content-title">
        <app-i18n code="entities.book.edit.title" v-if="isEditing"></app-i18n>
        <app-i18n code="entities.book.new.title" v-if="!isEditing"></app-i18n>
      </h1>

      <div class="app-page-spinner" v-if="findLoading" v-loading="findLoading"></div>
      
      <app-book-form
        :isEditing="isEditing"
        :record="record"
        :saveLoading="saveLoading"
        @cancel="doCancel"
        @submit="doSubmit"
        v-if="!findLoading"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import BookForm from '@/modules/book/components/book-form';
import { routerAsync } from '@/app-module';

export default {
  name: 'app-book-form-page',

  props: ['id'],

  components: {
    [BookForm.name]: BookForm,
  },

  computed: {
    ...mapGetters({
      record: 'book/form/record',
      findLoading: 'book/form/findLoading',
      saveLoading: 'book/form/saveLoading',
    }),

    isEditing() {
      return !!this.id;
    },
  },

  async created() {
    if (this.isEditing) {
      await this.doFind(this.id);
    } else {
      await this.doNew();
    }
  },

  methods: {
    ...mapActions({
      doFind: 'book/form/doFind',
      doNew: 'book/form/doNew',
      doUpdate: 'book/form/doUpdate',
      doCreate: 'book/form/doCreate',
    }),

    doCancel() {
      routerAsync().push('/book');
    },

    async doSubmit(payload) {
      if (this.isEditing) {
        return this.doUpdate(payload);
      } else {
        return this.doCreate(payload.values);
      }
    },
  },
};
</script>

<style>
</style>
