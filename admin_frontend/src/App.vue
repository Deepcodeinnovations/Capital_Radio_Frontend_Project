<template>
  <div class="min-h-screen bg-gray-100">
    <router-view />
  </div>
</template>
<script setup>
import { computed, onMounted } from 'vue';
import { useStore } from 'vuex';

const store = useStore();

const clientdata = computed(() => store.getters.clientdata);
const apierror = computed(() => store.getters.apierror);
const errors = computed(() => store.getters.errors);
const error = computed(() => store.getters.error);


const getclientlocationanddevicedata = () => {
  return store.dispatch('getclientlocationanddevicedata');
};


const calculate10daysfromaccesstime = () => {
  const access_time = clientdata.value.access_time;
  const access_time_date = new Date(access_time);
  const access_time_date_10days = new Date(access_time_date.getTime() + 10 * 24 * 60 * 60 * 1000);
  return access_time_date_10days;
};

onMounted(() => {
  if (clientdata.value) {
    if (calculate10daysfromaccesstime() < new Date().toISOString()) {
      getclientlocationanddevicedata();
    }
  } else {
    getclientlocationanddevicedata();
  }
});
</script>
