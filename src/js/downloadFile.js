import { notification } from 'ant-design-vue';

export const downloadFile = (url, nameSong) => {
    try {
        if (!url) {
            notification.error({
                message: 'Download Failed',
                description: 'URL is required',
                duration: 3,
            });
            return;
        }

        const urlString = url.split('/').pop();
        const fileName = urlString.split('.').shift();
        const fileExtension = urlString.split('.').pop();
        const fileUrl = `https://res.cloudinary.com/dxgqkbchh/video/upload/fl_attachment/${fileName}.${fileExtension}`;
        
        const a = document.createElement('a');
        a.href = fileUrl;
        a.download = nameSong || fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        notification.success({
            message: 'Download Successful',
            description: `${nameSong || fileName} has been downloaded successfully`,
            duration: 3,
        });

        return fileUrl;
    } catch (error) {
        console.error('Download error:', error);
        notification.error({
            message: 'Download Failed',
            description: 'An error occurred while downloading the file',
            duration: 3,
        });
    }
}