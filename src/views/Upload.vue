<template>
    <Header></Header>
    <div class="flex items-center justify-center min-h-screen xl:min-h-screen lg:min-h-[700px] md:min-h-[500px] ">

        <div
            class="w-[1200px] h-[700px] pt-16 m-auto xl:w-[1200px] lg:w-[960px] md:w-[700px] xl:mx-auto lg:mx-auto md:mx-auto">
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
import axios from 'axios';

export default {
    name: 'UploadPage',

    data() {
        return {
            fileUpload: null,
        }
    },
    components: {
        Header,
        Footer
    },
    methods: {
        async getAudioDuration(file) {
            return new Promise((resolve, reject) => {
                const audio = new Audio();
                audio.src = URL.createObjectURL(file);
                console.log("Object URL:", audio.src );

                audio.addEventListener("loadedmetadata", () => {
                    resolve(audio.duration);
                });

                audio.addEventListener("error", (err) => {
                    reject("Cannot load audio file.",err);
                });
            })
        },

        async handleFileUpload(event) {
            const file = event.target.files[0];
            if (!file) {
                alert("No file selected.");
                return;
            }
            console.log(file);


            try {
                const duration = await this.getAudioDuration(file);
                console.log("Audio Duration:", duration); 

                const formData = new FormData();
                formData.append("file", file);
                formData.append("upload_preset", "ml_default");
                formData.append("resource_type", "video"); 


                const response = await axios.post(
                    "https://api.cloudinary.com/v1_1/dxgqkbchh/video/upload",
                    formData
                );


                const fileUrl = response.data.secure_url;
                const fileName = file.name;

                console.log(response.status);

                console.log("Uploaded File URL:", fileUrl);


                this.$router.push({
                    name: 'InfoSongUpload',
                    query: {
                        fileUrl: fileUrl, 
                        fileName: fileName,
                        duration : duration
                    },
                });
            } catch (error) {
                console.error("Error uploading file:", error);
                alert("Upload failed. Please try again.");
            }
        },
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

@media (min-width: 1024px) {
    .btn-warning {
        padding: 20px 25px;
    }
}

@media (min-width: 768px) {
    .btn-warning {
        padding: 20px 25px;
    }
}

.btn-warning input[type="file"] {
    cursor: pointer;
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0%;
    top: 0%;
    /* transform: scale(3); */
    opacity: 0;
}
</style>