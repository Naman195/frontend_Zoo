import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import CustomToast from "~/components/CustomToast.vue"; // Ensure the path is correct

export const useToastNotify = () => {
  const showToast = (message: string, color: string = "black") => {
    toast({
      render: () => h(CustomToast, { message, color }),
      position: "top-center",
    //   position: toast.POSITION.TOP_CENTER,
      type: "default",
      autoClose: 5000,
    });
  };

  return { showToast };
};
