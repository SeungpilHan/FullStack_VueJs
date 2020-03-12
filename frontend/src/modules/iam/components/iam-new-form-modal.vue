<template>
  <div>
    <el-dialog :title="title" :visible.sync="dialogVisible" width="80%">
      <app-iam-new-form
        :modal="true"
        :record="record"
        :saveLoading="saveLoading"
        :single="true"
        @cancel="doCancel"
        @submit="doSubmit"
      />
    </el-dialog>
  </div>
</template>

<script>
import IamNewForm from '@/modules/iam/components/iam-new-form';
import { IamService } from '@/modules/iam/iam-service';
import { i18n } from '@/i18n';
import Errors from '@/shared/error/errors';

export default {
  name: 'app-iam-new-form-modal',

  props: ['visible'],

  components: {
    [IamNewForm.name]: IamNewForm,
  },

  data() {
    return {
      record: null,
      saveLoading: false,
    };
  },

  computed: {
    dialogVisible: {
      get: function() {
        return this.visible;
      },

      set: function(value) {
        if (!value) {
          this.$emit('close');
        }
      },
    },

    title() {
      return i18n('iam.new.titleModal');
    },
  },

  methods: {
    async doSubmit(payload) {
      try {
        this.saveLoading = true;
        await IamService.create(payload.values);
        const { rows } = await IamService.fetchUsers(
          {
            email: payload.values.emails[0],
          },
          null,
          1,
          0,
        );

        this.$emit('success', rows[0]);
      } catch (error) {
        Errors.handle(error);
      } finally {
        this.saveLoading = false;
      }
    },

    doCancel() {
      this.dialogVisible = false;
    },
  },
};
</script>

<style>
</style>
