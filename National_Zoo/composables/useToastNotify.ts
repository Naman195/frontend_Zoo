import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import CustomToast from "~/components/CustomToast.vue"; 

export const useToastNotify = () => {
  const showToast = (message: string, color: string = "black") => {
    toast({
      render: () => h(CustomToast, { message, color })
    });
  };

  return { showToast };
};
