import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import CustomToast from "~/components/CustomToast.vue"; 
import { isClient } from "@vueuse/core";

export const useToastNotify = () => {
  const showToast = (message: string, color: string = "black") => {
    if (isClient) {

      toast({
        render: () => h(CustomToast, { message, color })
      });
    };
  }

  return { showToast };
};
