<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">
        <app-i18n code="home.menu"></app-i18n>
      </el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/loan' }">
        <app-i18n code="entities.loan.menu"></app-i18n>
      </el-breadcrumb-item>
      <el-breadcrumb-item>
        <app-i18n code="entities.loan.edit.title" v-if="isEditing"></app-i18n>
        <app-i18n code="entities.loan.new.title" v-if="!isEditing"></app-i18n>
      </el-breadcrumb-item>
    </el-breadcrumb>

    <div class="app-content-page">
      <h1 class="app-content-title">
        <app-i18n code="entities.loan.edit.title" v-if="isEditing"></app-i18n>
        <app-i18n code="entities.loan.new.title" v-if="!isEditing"></app-i18n>
      </h1>

      <div class="app-page-spinner" v-if="findLoading" v-loading="findLoading"></div>
      
      <app-loan-form
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
import LoanForm from '@/modules/loan/components/loan-form';
import { routerAsync } from '@/app-module';

export default {
  name: 'app-loan-form-page',

  props: ['id'],

  components: {
    [LoanForm.name]: LoanForm,
  },

  computed: {
    ...mapGetters({
      record: 'loan/form/record',
      findLoading: 'loan/form/findLoading',
      saveLoading: 'loan/form/saveLoading',
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
      doFind: 'loan/form/doFind',
      doNew: 'loan/form/doNew',
      doUpdate: 'loan/form/doUpdate',
      doCreate: 'loan/form/doCreate',
    }),

    doCancel() {
      routerAsync().push('/loan');
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
