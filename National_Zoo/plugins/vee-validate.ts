import { defineRule, configure } from 'vee-validate';
import { all } from '@vee-validate/rules';
import { localize } from '@vee-validate/i18n';

export default defineNuxtPlugin(() => {
  Object.entries(all).forEach(([name, rule]) => {
    defineRule(name, rule);


    configure( {
      generateMessage : localize("en", {
        messages: {
          required: '{field} is required'
            
        }
      })
    })


  });
});