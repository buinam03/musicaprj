<template>
    <Header></Header>
    <div class="flex items-center justify-center min-h-screen">
        
        <div class="w-[1200px] h-[700px] pt-16 m-auto">
            <div class="h-full w-full flex items-center justify-center">
                <div class="m-auto items-center w-[800px] h-[400px] rounded-md shadow-2xl flex justify-center">
                    <div class="h-[200px] w-full">
                        <div class="font-semibold pb-10">
                            Upload your best music here
                        </div>
                        <button type="button" class="btn-warning hover:bg-orange-500 duration-300 hover:scale-110">
                            <font-awesome-icon icon="fa-solid fa-upload" />
                            Choose file to upload
                            <input type="file" @change="handleFileUpload" id="fileUpload"
                                accept=".wav,.mp3,.flac,.alac,.aiff">
                        </button>
                        <div class="pt-20 text-xs">
                            Provide FLAC, WAV, ALAC, or AIFF for highest audio quality
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
    </div>
    <Footer></Footer>
</template>

<script>
import Footer from '@/components/Footer.vue';
import Header from '@/components/Header.vue';

export default {
    name: 'UploadPage',

    data() {
        return {

        }
    },
    components: {
        Header,
        Footer
    },
    methods: {
        handleFileUpload(event) {
            const fileUpload = event.target.files;
            if (fileUpload.length > 0) {
                const fileName = fileUpload[0].name;
                this.$router.push({ name: 'InfoSongUpload', params: { fileName } });
            } else {
                console.log('Không có file nào được chọn.');
            }
        }
    }
}
</script>

<style scoped>
.btn-warning {
    position: relative;
    padding: 25px 31px;
    font-size: 15px;
    line-height: 1.5;
    border-radius: 4px;
    color: #fff;
    background-color: orange;
    border: 0;
    transition: 0.2s;
    overflow: hidden;

}

.btn-warning input[type="file"] {
    cursor: pointer;
    position: absolute;
    left: 0%;
    top: 0%;
    transform: scale(3);
    opacity: 0;
}
</style>