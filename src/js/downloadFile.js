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

        if (url.includes('cloudinary.com')) {
            const urlParts = url.split('/upload/');
            if (urlParts.length < 2) {
                notification.error({
                    message: 'Download Failed',
                    description: 'Invalid Cloudinary URL format',
                    duration: 3,
                });
                return;
            }

            let publicIdWithVersion = urlParts[1];
            
            if (publicIdWithVersion.startsWith('v')) {
                const versionEnd = publicIdWithVersion.indexOf('/');
                if (versionEnd > 0) {
                    publicIdWithVersion = publicIdWithVersion.substring(versionEnd + 1);
                }
            }

            const fileUrl = `https://res.cloudinary.com/dxgqkbchh/video/upload/fl_attachment/${publicIdWithVersion}`;
            
            const lastDotIndex = publicIdWithVersion.lastIndexOf('.');
            const fileNameWithoutExt = lastDotIndex > 0 
                ? publicIdWithVersion.substring(0, lastDotIndex) 
                : publicIdWithVersion;

            const a = document.createElement('a');
            a.href = fileUrl;
            a.download = nameSong || fileNameWithoutExt;
            a.target = '_blank'; // Open in new tab as fallback
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

            notification.success({
                message: 'Download Successful',
                description: `${nameSong || fileNameWithoutExt} has been downloaded successfully`,
                duration: 3,
            });

            return fileUrl;
        } else {
            // For non-Cloudinary URLs, download directly
            const a = document.createElement('a');
            a.href = url;
            a.download = nameSong || 'download';
            a.target = '_blank';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

            notification.success({
                message: 'Download Successful',
                description: `${nameSong || 'File'} has been downloaded successfully`,
                duration: 3,
            });

            return url;
        }
    } catch (error) {
        console.error('Download error:', error);
        notification.error({
            message: 'Download Failed',
            description: 'An error occurred while downloading the file',
            duration: 3,
        });
    }
}