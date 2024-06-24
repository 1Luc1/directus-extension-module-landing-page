<template>
  <private-view :title="page_title">
    <template #navigation>
      <page-navigation :current="page" :pages="all_pages" />
    </template>

    <div class="lp-container">
      <div class="lp-body" v-if="page_body" v-html="page_body"></div>
    </div>

    <router-view name="landing-page" :page="page" />
  </private-view>
</template>

<script setup>
import { ref, watch, defineProps } from "vue";
import { useApi } from "@directus/extensions-sdk";
import PageNavigation from "./components/navigation.vue";

const props = defineProps({
  page: {
    type: String,
    default: "info",
  },
});

const locals = {
  de: {
    info: "Info",
    "add-person": "Künstler:in hinzufügen",
    "add-ensemble": "Ensemble/Verein hinzufügen",
    contact: "Kontakt",
  },
  en: {
    info: "Info",
    "add-person": "Add Artist",
    "add-ensemble": "Add Ensemble/Club",
    contact: "Contact",
  },
};

const api = useApi();
const page_title = ref("");
const page_body = ref("");
const current_language = ref("");
const all_pages = ref([]);

render_page(props.page);

watch(
  () => props.page,
  () => {
    render_page(props.page);
  }
);

async function render_page(page) {
  if (page === null) {
    page_title.value = "500: Internal Server Error";
    page_body.value = "";
  } else {
    await fetch_language();
    fetch_all_pages();
    var response;
    try {
      const rsp = await fetch(
        `/items/pages/${page}?fields=slug,translations.title,translations.content&deep={"translations":{"_filter":{"languages_code":{"_contains":"${current_language.value}"}}}}`,
        { credentials: "omit" }
      );
      response = await rsp.json();
    } catch (error) {
      console.log(`Error loading page ${page}. Does it exist?`);
    }

    if (response.data) {
      page_title.value = response.data.translations[0].title;
      page_body.value = response.data.translations[0].content;
    } else {
      page_title.value = "404: Not Found";
    }
  }
}

function t(key) {
  const currentLocal = current_language.value.substring(0, 2);
  if (locals.hasOwnProperty(currentLocal)) {
    return locals[currentLocal][key];
  }
  return key;
}

function fetch_all_pages() {
  all_pages.value = [
    {
      label: t("info"),
      uri: "info",
      to: "/landing-page",
      icon: "info",
      color: "#6644FF",
    },
    { type: "divider", inset: true },
    {
      label: t("add-person"),
      uri: "add-person",
      to: "/content/persons/+",
      icon: "person_add",
      color: "#2ECDA7",
    },
    {
      label: t("add-ensemble"),
      uri: "add-ensemble",
      to: "/content/ensembles/+",
      icon: "group_add",
      color: "#2ECDA7",
    },
    { type: "divider", inset: true },
    {
      label: t("contact"),
      uri: "contact",
      to: "/landing-page/contact",
      icon: "contact_support",
      color: "#3399FF",
    },
  ];
}

async function fetch_language() {
  const me = await api.get("/users/me");
  if (me.data.data.language) {
    current_language.value = me.data.data.language;
  } else {
    const setting = await api.get("/settings");
    current_language.value = setting.data.data.default_language;
  }
  // set fallback language to en
  const currentLocal = current_language.value.substring(0, 2);
  if (!locals.hasOwnProperty(currentLocal)) {
    current_language.value = "en";
  }
}
</script>

<style lang="scss">
.lp-container {
  padding: var(--content-padding);
  padding-top: 0;
  width: 100%;
  max-width: 1024px;

  & > div {
    margin-bottom: var(--content-padding);
  }
}
</style>
