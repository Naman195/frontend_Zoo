export default defineEventHandler(async (event) => {
  return await $fetch("http://localhost:8080/role/all");
});
