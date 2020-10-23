import Vue from 'vue'

// import UiButton from '@/components/UI/UiButton'
// import UiInput from '@/components/UI/UiInput'
import TreeTable from 'tree-table-vue';
import Multiselect from 'vue-multiselect';
import Ripple from 'vue-ripple-directive';

Vue.directive('ripple', Ripple);
Vue.use(TreeTable);
Vue.component('Multiselect', Multiselect);

//
// Vue.component('UiButton', UiButton)
// Vue.component('UiInput', UiInput)
