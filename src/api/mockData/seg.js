export default {
    getSegResult: () => {
        return {
            ret_code: "0",
            message: "",
            data: {
                scene_in_seconds: [
                    [0, 1],
                    [1, 2],
                    [2, 3],
                    [3, 4],
                    [4, 5],
                    [5, 6],
                    [6, 7],
                    [7, 8],
                    [8, 9],
                    [9, 10]
                ],
                cos_urls: [
                    'https://ua-sg-1300342648.cos.ap-singapore.myqcloud.com/cvinsights_avtr/arthub/2021-10-28 17-47-31.mp4',
                    'https://ua-sg-1300342648.cos.ap-singapore.myqcloud.com/cvinsights_avtr/arthub/2021-10-29 18-06-18.mp4',
                    'https://ua-sg-1300342648.cos.ap-singapore.myqcloud.com/cvinsights_pubgm/google_drive/RG02387-PUBGM-V-1-FR-TENCENT.mp4',
                    'https://ua-sg-1300342648.cos.ap-singapore.myqcloud.com/cvinsights_avtr/arthub/2021-10-28 20-04-13.mp4'
                ]
            }
        }
    }   
}