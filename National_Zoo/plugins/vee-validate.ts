import { defineRule, configure } from 'vee-validate';
import { all, digits } from '@vee-validate/rules';
import { localize } from '@vee-validate/i18n';

export default defineNuxtPlugin(() => {
  Object.entries(all).forEach(([name, rule]) => {
    defineRule(name, rule);


    configure( {
      generateMessage : localize("en", {
        messages: {
          required: '{field} is required',
          min: '{field} length  must be greater then equalTo 0:{min}!!',
          digits: '{field} must be of 0:{digits} Numbers'

            
        }
      })
    })


  });
});