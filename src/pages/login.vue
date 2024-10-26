<script setup>
import { useGenerateImageVariant } from '@core/composable/useGenerateImageVariant'
import authV2LoginIllustrationLight from '@images/gabonmailinfos_TransUrb_fin_mouvement_humeur.jpg'
import authV2LoginIllustrationDark from '@images/images.png'
import authV2LoginIllustrationBorderedDark from '@images/pages/auth-v2-login-illustration-bordered-dark.png'
import authV2LoginIllustrationBorderedLight from '@images/pages/auth-v2-login-illustration-bordered-light.png'
import authV2MaskDark from '@images/pages/misc-mask-dark.png'
import authV2MaskLight from '@images/pages/misc-mask-light.png'
import { VNodeRenderer } from '@layouts/components/VNodeRenderer'
import { themeConfig } from '@themeConfig'
import { useRouter } from 'vue-router'

definePage({
  meta: {
    layout: 'blank',
    public: true,
  },
})
const router = useRouter();
const form = ref({
  email: '',
  password: '',
  remember: false,
})

const login = () => {

  // Add your authentication logic here
  if (form.value.email && form.value.password) {
    // Example: Set a cookie if 'remember' is checked
    if (form.value.remember) {
      useCookie('rememberMe').value = form.value.email;

      fetch("http://51.178.42.116:8089/api/utilisateurs")
        .then((resp) => resp.json())
        .then((data) => {
          // updateData(data);
          console.log('Connecter avec', data);
          if (data.nom == form.value.email) {
            useCookie('userData').value = data;
            router.push('/');
          } else {
            router.push('/login');
          }
        });
    }

    // Clear the cookie if 'remember' is unchecked
    else {
      useCookie('rememberMe').value = ''; // Clear cookie
    }


    // Redirect or perform further actions
  } else {
    console.error('Email and password are required.');
    fetch("http://localhost:8080/api/utilisateurs")
      .then((resp) => resp.json())
      .then((data) => {
        // updateData(data);
        console.log('Connecter avec', data);
        if (data.nom == form.value.email) {
          useCookie('userData').value = data;
          router.push('/');
        } else {
          router.push('/login');
        }
      });
  }
};


const isPasswordVisible = ref(false)
const authThemeImg = useGenerateImageVariant(authV2LoginIllustrationLight, authV2LoginIllustrationDark, authV2LoginIllustrationBorderedLight, authV2LoginIllustrationBorderedDark, true)
const authThemeMask = useGenerateImageVariant(authV2MaskLight, authV2MaskDark)
</script>

<template>
  <a href="javascript:void(0)">
    <div class="auth-logo d-flex align-center gap-x-3">
      <VNodeRenderer :nodes="themeConfig.app.logo" />
      <h1 class="auth-title">
        {{ themeConfig.app.title }}
      </h1>
    </div>
  </a>

  <VRow no-gutters class="auth-wrapper bg-surface">
    <VCol md="8" class="d-none d-md-flex">
      <div class="position-relative bg-background w-100 me-0">
        <div class="d-flex align-center justify-center w-100 h-100" style="padding-inline: 6.25rem;">
          <VImg max-width="800" :src="authThemeImg" class="auth-illustration mt-16 mb-2 rounded" />
        </div>

        <img class="auth-footer-mask flip-in-rtl" :src="authThemeMask" alt="auth-footer-mask" height="280" width="100">
      </div>
    </VCol>

    <VCol cols="12" md="4" class="auth-card-v2 d-flex align-center justify-center">
      <VCard flat :max-width="500" class="mt-12 mt-sm-0 pa-6">
        <VCardText>
          <h4 class="text-h4 mb-1">
            Bienvenue <span class="text-capitalize">{{ themeConfig.app.title }}</span>! 👋🏻
          </h4>
          <p class="mb-0">

          </p>
        </VCardText>
        <VCardText>
          <VForm @submit.prevent="login">
            <VRow>
              <!-- email -->
              <VCol cols="12">
                <AppTextField v-model="form.email" autofocus label="Nom" type="Text" placeholder="Mboumba" />
              </VCol>

              <!-- password -->
              <VCol cols="12">
                <AppTextField v-model="form.password" label="Mot de passe" placeholder="············" type="text" />

                <div class="d-flex align-center flex-wrap justify-space-between my-6">
                  <VCheckbox v-model="form.remember" label="Se Rappeler de moi" />

                </div>

                <VBtn block type="submit" color="success">
                  Connection
                </VBtn>
              </VCol>



            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>

<style lang="scss">
@use "@core/scss/template/pages/page-auth.scss";
</style>
