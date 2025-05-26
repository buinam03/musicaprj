import { createApp } from 'vue'
import App from './App.vue'
import router from './routers/router'
import { createPinia } from 'pinia'
import '@/styles/tailwind.css'
import piniaPluginPersistedState from 'pinia-plugin-persistedstate'

/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'

/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faHeart as faHeartRegular, faImage, faPaperPlane } from '@fortawesome/free-regular-svg-icons';

/* import specific icons */
import { faBackwardStep, faBell, faChevronDown, faCircleChevronDown, faMessage, faPause, faPlay, faUserSecret, faForwardStep, faShuffle, faRepeat, faVolumeXmark, faVolumeHigh, faVolumeLow, faHeart, faXmark, faGrip, faCheck, faPerson, faUserPlus, faChevronLeft, faChevronRight, faPlus, faEllipsis, faUpload, faPencil, faTrash, faCamera, faChartColumn, faTrophy, faLock, faPen, faUnlock, faAnglesRight, faAnglesLeft, faMagnifyingGlass, faCompactDisc, faUser, faMusic, faComment, faUserCheck, faNotesMedical, faComments, faArrowRight, faBars, faInfo } from '@fortawesome/free-solid-svg-icons'
import { faGoogle } from '@fortawesome/free-brands-svg-icons'

/* add icons to the library */
library.add(faUserSecret, faCircleChevronDown, faChevronDown, faBell, faMessage, faBackwardStep, faForwardStep, faPlay, faPause, faShuffle, faRepeat, faVolumeXmark, faVolumeHigh, faVolumeLow, faHeart, faXmark, faGrip, faCheck, faPerson, faUserPlus, faChevronLeft, faChevronRight, faPlus, faEllipsis, faHeartRegular, faUpload, faImage, faPencil, faTrash, faCamera, faChartColumn, faTrophy, faLock, faPen, faUnlock, faAnglesRight, faAnglesLeft, faMagnifyingGlass, faCompactDisc, faUser, faMusic, faComment, faUserCheck, faPaperPlane, faNotesMedical, faComments, faArrowRight, faGoogle, faBars, faUserCheck, faInfo)


router.afterEach((to) => {
    if (to.meta.title) {
        document.title = to.meta.title
    }
})

const pinia = createPinia();
pinia.use(piniaPluginPersistedState);

createApp(App)
    .use(pinia)
    .use(router)
    .component('font-awesome-icon', FontAwesomeIcon)
    .mount('#app')
