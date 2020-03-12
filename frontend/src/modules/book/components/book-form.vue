<template>
  <div>
    <el-form
      :label-position="labelPosition"
      :label-width="labelWidthForm"
      :model="model"
      :rules="rules"
      @submit.native.prevent="doSubmit"
      class="form"
      ref="form"
      v-if="model"
    >
      <el-form-item :label="fields.id.label" :prop="fields.id.name" v-if="isEditing">
        <el-col :lg="11" :md="16" :sm="24">
          <el-input :disabled="true" v-model="model[fields.id.name]" />
        </el-col>
      </el-form-item>
              <el-form-item
          :label="fields.isbn.label"
          :prop="fields.isbn.name"
          :required="fields.isbn.required"
        >
          <el-col :lg="11" :md="16" :sm="24">
            <el-input v-model="model[fields.isbn.name]" ref="focus" />
          </el-col>
        </el-form-item>

        <el-form-item
          :label="fields.title.label"
          :prop="fields.title.name"
          :required="fields.title.required"
        >
          <el-col :lg="11" :md="16" :sm="24">
            <el-input v-model="model[fields.title.name]" />
          </el-col>
        </el-form-item>

        <el-form-item
          :label="fields.author.label"
          :prop="fields.author.name"
          :required="fields.author.required"
        >
          <el-col :lg="11" :md="16" :sm="24">
            <el-input v-model="model[fields.author.name]" />
          </el-col>
        </el-form-item>

        <el-form-item
          :label="fields.numberOfCopies.label"
          :prop="fields.numberOfCopies.name"
          :required="fields.numberOfCopies.required"
        >
          <el-col :lg="11" :md="16" :sm="24">
            <el-input-number :precision="0" :step="1" v-model="model[fields.numberOfCopies.name]" ></el-input-number>
          </el-col>
        </el-form-item>

        <el-form-item
          :label="fields.stock.label"
          :prop="fields.stock.name"
          :required="fields.stock.required"
        >
          <el-col :lg="11" :md="16" :sm="24">
            <el-input-number :precision="0" :step="1" v-model="model[fields.stock.name]" ></el-input-number>
          </el-col>
        </el-form-item>

        <el-form-item
          :label="fields.images.label"
          :prop="fields.images.name"
          :required="fields.images.required"
        >
          <el-col :lg="11" :md="16" :sm="24">
            <app-image-upload
              :max="fields.images.max"
              :path="fields.images.path"
              :schema="fields.images.fileSchema"
              v-model="model[fields.images.name]"
            ></app-image-upload>
          </el-col>
        </el-form-item>

        <el-form-item
          :label="fields.status.label"
          :prop="fields.status.name"
          :required="fields.status.required"
        >
          <el-col :lg="11" :md="16" :sm="24">
            <el-select placeholder v-model="model[fields.status.name]">
              <el-option :value="undefined">--</el-option>
              <el-option
                :key="option.id"
                :label="option.label"
                :value="option.id"
                v-for="option in fields.status.options"
              ></el-option>
            </el-select>
          </el-col>
        </el-form-item>
      <el-form-item>
        <div class="form-buttons">
          <el-button
            :disabled="saveLoading"
            @click="doSubmit"
            icon="el-icon-fa-floppy-o"
            type="primary"
          >
            <app-i18n code="common.save"></app-i18n>
          </el-button>

          <el-button :disabled="saveLoading" @click="doReset" icon="el-icon-fa-undo">
            <app-i18n code="common.reset"></app-i18n>
          </el-button>

          <el-button :disabled="saveLoading" @click="doCancel" icon="el-icon-fa-close">
            <app-i18n code="common.cancel"></app-i18n>
          </el-button>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { FormSchema } from '@/shared/form/form-schema';
import { BookModel } from '@/modules/book/book-model';

const { fields } = BookModel;
const formSchema = new FormSchema([
  fields.id,
  fields.isbn,
  fields.title,
  fields.author,
  fields.numberOfCopies,
  fields.stock,
  fields.images,
  fields.status,
]);

export default {
  name: 'app-book-form',

  props: ['isEditing', 'record', 'saveLoading', 'modal'],

  data() {
    return {
      rules: formSchema.rules(),
      model: null,
    };
  },

  created() {
    this.model = formSchema.initialValues(
      this.record || {},
    );
  },

  computed: {
    ...mapGetters({
      labelPosition: 'layout/labelPosition',
      labelWidthForm: 'layout/labelWidthForm',
    }),

    fields() {
      return fields;
    },
  },

  methods: {
    doReset() {
      this.model = formSchema.initialValues(this.record);
    },

    doCancel() {
      this.$emit('cancel');
    },

    async doSubmit() {
      try {
        await this.$refs.form.validate();
      } catch (error) {
        return;
      }

      const { id, ...values } = formSchema.cast(this.model);

      return this.$emit('submit', {
        id,
        values,
      });
    },
  },
};
</script>

<style>
</style>
