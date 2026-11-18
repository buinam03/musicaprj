<template>
    <div v-if="mode"
        class="fixed inset-0 flex justify-center items-center bg-black/60 backdrop-blur-sm w-full h-full m-auto z-40 p-4"
        @click.self="close">
        <div
            class="w-full max-w-md bg-white border border-gray-300 rounded-2xl shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button @click="close" class="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors">
                <font-awesome-icon icon="fa-solid fa-times" class="text-xl" />
            </button>

            <!-- Sign In -->
            <div v-if="mode === 'login'" class="p-6 sm:p-8">
                <div class="text-center text-3xl sm:text-4xl font-semibold text-gray-800 mb-6 sm:mb-8">
                    Sign In
                </div>
                <div class="space-y-4 sm:space-y-6">
                    <div>
                        <input v-model="form.email"
                            class="w-full h-12 sm:h-14 border-gray-400 border px-4 outline-none rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all text-base"
                            placeholder="Your Email" type="email" name="email" id="signin-email">
                    </div>
                    <div class="relative">
                        <input v-model="form.password"
                            class="w-full h-12 sm:h-14 border-gray-400 border px-4 pr-12 outline-none rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all text-base"
                            placeholder="Password" :type="passwordType" name="password" id="password">
                        <PasswordToggle />
                    </div>
                    <div class="text-right">
                        <a href="#" class="text-sm text-gray-600 hover:text-orange-500 hover:underline transition-colors">
                            Forgot Password?
                        </a>
                    </div>
                    <div>
                        <button @click="signIn" :disabled="submitting"
                            class="w-full h-12 sm:h-14 border-2 border-orange-500 cursor-pointer bg-orange-500 hover:bg-orange-600 rounded-lg text-white flex justify-center items-center font-semibold text-lg sm:text-xl transition-colors">
                            <span>Log In</span>
                            <font-awesome-icon icon="fa-solid fa-arrow-right" class="ml-2" />
                        </button>
                    </div>
                    <div class="text-center text-gray-600 text-sm sm:text-base pt-2">
                        Don't have an account? <button @click="switchTo('register')"
                            class="text-orange-500 hover:text-orange-600 underline font-semibold transition-colors">Create
                            Account</button>
                    </div>
                </div>
            </div>

            <!-- Create Account -->
            <div v-else class="p-6 sm:p-8">
                <div class="text-center text-3xl sm:text-4xl font-semibold text-gray-800 mb-6 sm:mb-8">
                    Create Account
                </div>
                <div class="space-y-4 sm:space-y-5">
                    <div>
                        <input v-model="form.username"
                            class="w-full h-12 sm:h-14 border-gray-500 border px-4 outline-none rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all text-base"
                            placeholder="Username" type="text" name="username" id="create-username">
                    </div>
                    <div>
                        <input v-model="form.email"
                            class="w-full h-12 sm:h-14 border-gray-500 border px-4 outline-none rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all text-base"
                            placeholder="Your Email" type="email" name="email" id="create-email">
                    </div>
                    <div class="relative">
                        <input v-model="form.password"
                            class="w-full h-12 sm:h-14 border-gray-500 border px-4 pr-12 outline-none rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all text-base"
                            placeholder="Password" :type="passwordType" name="password" id="create-password">
                        <PasswordToggle />
                    </div>
                    <div class="relative">
                        <input v-model="reEnterPassword"
                            class="w-full h-12 sm:h-14 border-gray-500 border px-4 pr-12 outline-none rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all text-base"
                            placeholder="Re-enter Password" :type="passwordType" name="re-password" id="re-en-password">
                        <PasswordToggle />
                    </div>
                    <div>
                        <button @click="createAccount" :disabled="submitting"
                            class="w-full h-12 sm:h-14 border-2 border-orange-500 cursor-pointer bg-orange-500 hover:bg-orange-600 rounded-lg text-white flex justify-center items-center font-semibold text-lg sm:text-xl transition-colors">
                            <span>Create Account</span>
                            <font-awesome-icon icon="fa-solid fa-arrow-right" class="ml-2" />
                        </button>
                    </div>
                    <div class="text-center text-gray-600 text-sm sm:text-base pt-2">
                        Already have an account? <button @click="switchTo('login')"
                            class="text-orange-500 hover:text-orange-600 underline font-semibold transition-colors">Sign
                            In</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, h, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { notification } from 'ant-design-vue';
import { authApi, getErrorMessage } from '@/api';
import { usePlayerStore } from '@/stores/player';
import { useFollow, useLike } from '@/composables';
import { getUserIdFromJWT } from '@/utils/jwt';
import eyeCloseIcon from '@/image/other/eye-close.png';
import eyeOpenIcon from '@/image/other/eye-open.png';

defineProps({
    /** 'login' | 'register' | null (đóng) */
    mode: { type: String, default: null },
});

const emit = defineEmits(['update:mode']);

const router = useRouter();
const playerStore = usePlayerStore();
const { loadLikedIds } = useLike();
const { loadFollowingIds } = useFollow();

const form = reactive({ username: '', email: '', password: '' });
const reEnterPassword = ref('');
const isShowPass = ref(false);
const submitting = ref(false);

const passwordType = computed(() => (isShowPass.value ? 'text' : 'password'));

/** Nút ẩn/hiện mật khẩu (dùng chung cho mọi ô password trong modal). */
const PasswordToggle = () =>
    h(
        'button',
        {
            type: 'button',
            class: 'absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors',
            onClick: () => (isShowPass.value = !isShowPass.value),
        },
        [
            h('img', {
                class: 'h-5 w-5 opacity-70',
                src: isShowPass.value ? eyeOpenIcon : eyeCloseIcon,
                alt: isShowPass.value ? 'Hide password' : 'Show password',
            }),
        ],
    );

const close = () => emit('update:mode', null);
const switchTo = (mode) => emit('update:mode', mode);

/** Lưu token, cập nhật session và làm mới cache like/follow. */
const startSession = async ({ email, password }) => {
    const { accessToken, refreshToken, userId } = await authApi.login({ email, password });
    localStorage.setItem('jwt', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    playerStore.setSession(userId ?? getUserIdFromJWT());
    loadLikedIds({ force: true });
    loadFollowingIds({ force: true });
};

const loginErrorDescription = (error) => {
    const status = error.response?.status;
    if (status === 404) return 'User not found. Please check your email and try again.';
    if (status === 400) return 'Wrong password. Please try again.';
    return getErrorMessage(error, 'An error occurred. Please try again later.');
};

const signIn = async () => {
    submitting.value = true;
    try {
        await startSession(form);
        router.push({ path: '/home' });
        close();
    } catch (error) {
        console.error('Login error:', error);
        notification.error({ message: 'Login Failed', description: loginErrorDescription(error), duration: 4 });
    } finally {
        submitting.value = false;
    }
};

const createAccount = async () => {
    if (form.password !== reEnterPassword.value) {
        notification.error({ message: 'Registration Failed', description: 'Passwords do not match.', duration: 4 });
        return;
    }

    submitting.value = true;
    try {
        await authApi.register(form);
    } catch (error) {
        console.error('Register error:', error);
        notification.error({
            message: 'Registration Failed',
            description: getErrorMessage(error, 'Failed to create account. Please try again.'),
            duration: 4,
        });
        submitting.value = false;
        return;
    }

    notification.success({
        message: 'Registration Successful',
        description: 'Your account has been created successfully. Logging you in...',
        duration: 3,
    });

    // Tự đăng nhập bằng tài khoản vừa tạo
    try {
        await startSession(form);
        close();
        router.push({ path: '/home' });
    } catch (error) {
        console.error('Auto-login failed:', error);
        notification.warning({
            message: 'Registration Successful',
            description: 'Please log in manually with your new account.',
            duration: 4,
        });
        close();
        router.push({ path: '/discover' });
    } finally {
        submitting.value = false;
    }
};
</script>
