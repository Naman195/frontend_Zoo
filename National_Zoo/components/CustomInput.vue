<template>
  <div class="form-group">
    <label :for="props.name">{{ props.label }}</label>
    <input
      :type="props.type"
      v-model="value"
      :name="props.name"
      :class="{ 'is-invalid': error }"
      @blur="validate"
    />
    <span v-if="error" class="error-message">{{ error }}</span>
  </div>
</template>

<script setup>
import { useField } from "vee-validate";
import { StringSchema } from "yup";

// interface Props {
//     label: String,
//     type: 'text' | 'email' | 'password'
//     name: String
//     validator?: StringSchema<String> | undefined
// }

// const props = withDefaults(defineProps<Props> {
//     validator: undefined
// })

const { value, errorMessage } = useField(props.name, props.validator);

const props = defineProps({
  name: { type: String, required: true },
  label: { type: String, required: true },
  type: { type: String, default: "text" },
});

const emit = defineEmits(["update:modelValue"]);

const {
  value: modelValue,
  errorMessage: error,
  validate,
} = useField(props.name);

const updateValue = (event) => {
  emit("update:modelValue", event.target.value);
};
</script>
<style scoped>
.error-message {
  color: red;
  font-size: 0.875em;
}
.is-invalid {
  border-color: red;
}
</style>
