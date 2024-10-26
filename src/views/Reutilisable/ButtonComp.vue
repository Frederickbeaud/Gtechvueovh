<style lang="css" scoped>
.btn {
  border-radius: 5px;
}

i {
  color: #fff;
}
</style>
<template>

  <div class="d-flex justify-content-center align-center">
    <button @click="handleActionClick()" data-bs-toggle="modal" class="btn btn-success ms-2"
      data-bs-target="#exampleModal">
      <i class="fa-regular fa-eye"></i>
    </button>
  </div>

</template>

<script>
import { defineComponent, toRefs } from 'vue';

export default defineComponent({
  setup(props, { emit }) {
    const { value } = toRefs(props.params); // Use toRefs to make value reactive

    function handleActionClick() {
      console.log(value.value); // Access the reactive value
      emit('actionClicked', value.value); // Emit the value
    }

    return { value, handleActionClick };
  }
});
</script>
