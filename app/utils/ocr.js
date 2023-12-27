import axios from 'axios';

const YOUR_API_KEY = 'K82132602588957';
const OCR_SPACE_ENDPOINT = 'https://api.ocr.space/parse/image';

export const performOCR = async (imageUrl) => {
  try {
    // const extension = imageUrl.split('.').pop().toLowerCase();
    // let filetype = '';

    // if (extension === 'png' || extension === 'jpg' || extension === 'jpeg' || extension === 'pdf') {
    //   filetype = extension; // Set filetype to the image's actual extension
    // } else {
    //   throw new Error('Unsupported file type');
    // }

    const formData = new FormData();
    formData.append('url', imageUrl);
    // formData.append('filetype', filetype);
    formData.append('language', 'eng'); // Change language as needed
    formData.append('isOverlayRequired', false); // or true based on requirement
    formData.append('iscreatesearchablepdf', false); // or true based on requirement
    formData.append('issearchablepdfhidetextlayer', false); // or true based on requirement
    formData.append('scale', true); // or true based on requirement
    formData.append('detectOrientation', true); // or true based on requirement
    formData.append('isTable', true); // or true based on requirement
    
    // Add other parameters as needed based on the API documentation

    const response = await axios.post(
      OCR_SPACE_ENDPOINT,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data', // Set content type to 'multipart/form-data'
          'apikey': YOUR_API_KEY, // Send API key as a header
        },
      }
    );

    if (response.status !== 200) {
      throw new Error('OCR request failed');
    }

    const result = response.data;

    // Handle response data here
    console.log('OCR Result:', result);
    return result;
  } catch (error) {
    console.error('Error performing OCR:', error);
    throw error;
  }
};
