import { createStore } from 'vuex'

export default createStore({
  state: {
    defaultVideoUrl: 'cvinsights_pubgm/google_drive/UA00830-PUBGM-V-1-EN-TENCENT.mp4',
    protalData: {
      seg: {
        sceneInSeconds: [],
        cosUrls: [],
        percentage: 0,
        status: '',
        isShowResult: false,
        dialogVisible: false,
        videoName: '',
        videoSize: '',
        videoTempName: '',
        videoTempSize: '',
        defaultDialogVisible: false,
        // 上传按钮
        uploadDisabled: false,
        defaultDisabled: false,
        rawFile: '',
        rawFileShow: false
      },
      cover: {
        keyFrameAt: 0,
        coverCosUrl: '',
        percentage: 0,
        status: '',
        isShowResult: false,
        dialogVisible: false,
        videoName: '',
        videoSize: '',
        videoTempName: '',
        videoTempSize: '',
        defaultDialogVisible: false,
        // 上传按钮
        uploadDisabled: false,
        defaultDisabled: false,
        rawFile: '',
        rawFileShow: false
      },
      tag: {
        sceneInSeconds: [],
        keyFramesUrl: [],
        tags: [],
        percentage: 0,
        status: '',
        isShowResult: false,
        dialogVisible: false,
        videoName: '',
        videoSize: '',
        videoTempName: '',
        videoTempSize: '',
        defaultDialogVisible: false,
        // 上传按钮
        uploadDisabled: false,
        defaultDisabled: false,
        rawFile: '',
        rawFileShow: false
      }
    },
    mlflowData: {
      yamlString: '',
      isModified: false
    }
  },
  getters: {
    handleCoverFrame(state) {
      return [state.protalData.cover.keyFrameAt + 's']
    },
    getFullDefaultPath(state) {
      return 'https://ua-sg-1300342648.cos.ap-singapore.myqcloud.com/' + state.defaultVideoUrl
    }
  },
  mutations: {
    // seg
    initSeg(state) {
      state.protalData.seg.isShowResult = false
      state.protalData.seg.rawFileShow = false
      state.protalData.seg.percentage = 0
      state.protalData.seg.status = ''
      state.protalData.seg.sceneInSeconds = []
      state.protalData.seg.cosUrls = []
      // state.protalData.seg.videoName = ''
      // state.protalData.seg.videoSize = 0
    },
    updateSegDialogVisible(state, payload) {
      state.protalData.seg.dialogVisible = payload.dialogVisible
    },
    updateSegVideoInfo(state, payload) {
      state.protalData.seg.videoName = payload.name
      state.protalData.seg.videoSize = payload.size
    },
    updateSegVideoTempInfo(state, payload) {
      state.protalData.seg.videoTempName = payload.name
      state.protalData.seg.videoTempSize = payload.size
    },
    // 设置seg上传实例对象
    setSegUploadRef(state, ref) {
      state.protalData.seg.uploadRef = ref
    },
    updateSegProgress(state, percentage) {
      state.protalData.seg.percentage = percentage
    },
    increaseSegProgress(state, percetage) {
      if (state.protalData.seg.percentage < 90) {
        state.protalData.seg.percentage += percetage
      } else if (state.protalData.seg.percentage < 98) {
        state.protalData.seg.percentage += 1
      }
    },
    updateSegSuccess(state, payload) {
      state.protalData.seg.sceneInSeconds = payload.sceneInSeconds
      state.protalData.seg.cosUrls = payload.cosUrls
      state.protalData.seg.percentage = 100
      state.protalData.seg.status = 'success'
      state.protalData.seg.isShowResult = true
    },
    updateSegError(state) {
      state.protalData.seg.percentage = 100
      state.protalData.seg.status = 'exception'
      state.protalData.seg.isShowResult = false
      state.protalData.seg.sceneInSeconds = []
      state.protalData.seg.cosUrls = []
    },
    updateSegDefaultDialogVisible(state, defaultDialogVisible) {
      state.protalData.seg.defaultDialogVisible = defaultDialogVisible
    },
    updateSegButton(state, payload) {
      state.protalData.seg.uploadDisabled = payload.uploadDisabled
      state.protalData.seg.defaultDisabled = payload.defaultDisabled
    },
    updateSegRawFile(state, rawFile) {
      state.protalData.seg.rawFile = rawFile
    },
    updateSegRawFileShow(state, rawFileShow) {
      state.protalData.seg.rawFileShow = rawFileShow
    },

    // cover
    initCover(state) {
      state.protalData.cover.isShowResult = false
      state.protalData.cover.rawFileShow = false
      state.protalData.cover.percentage = 0
      state.protalData.cover.status = ''
      state.protalData.cover.keyFrameAt = 0
      state.protalData.cover.coverCosUrl = ''
      // state.protalData.cover.videoName = ''
      // state.protalData.cover.videoSize = 0
    },
    updateCoverDialogVisible(state, payload) {
      state.protalData.cover.dialogVisible = payload.dialogVisible
    },
    updateCoverVideoInfo(state, payload) {
      state.protalData.cover.videoName = payload.name
      state.protalData.cover.videoSize = payload.size
    },
    updateCoverVideoTempInfo(state, payload) {
      state.protalData.cover.videoTempName = payload.name
      state.protalData.cover.videoTempSize = payload.size
    },
    // 设置cover上传实例对象
    setCoverUploadRef(state, ref) {
      state.protalData.cover.uploadRef = ref
    },
    updateCoverProgress(state, percentage) {
      state.protalData.cover.percentage = percentage
    },
    increaseCoverProgress(state, percetage) {
      if (state.protalData.cover.percentage < 90) {
        state.protalData.cover.percentage += percetage
      } else if (state.protalData.cover.percentage < 98) {
        state.protalData.cover.percentage += 1
      }
    },
    updateCoverSuccess(state, payload) {
      state.protalData.cover.keyFrameAt = payload.keyFrameAt
      state.protalData.cover.coverCosUrl = payload.coverCosUrl
      state.protalData.cover.percentage = 100
      state.protalData.cover.status = 'success'
      state.protalData.cover.isShowResult = true
    },
    updateCoverError(state) {
      state.protalData.cover.percentage = 100
      state.protalData.cover.status = 'exception'
      state.protalData.cover.isShowResult = false
      state.protalData.cover.keyFrameAt = 0
      state.protalData.cover.coverCosUrl = ''
    },
    updateCoverDefaultDialogVisible(state, defaultDialogVisible) {
      state.protalData.cover.defaultDialogVisible = defaultDialogVisible
    },
    updateCoverButton(state, payload) {
      state.protalData.cover.uploadDisabled = payload.uploadDisabled
      state.protalData.cover.defaultDisabled = payload.defaultDisabled
    },
    updateCoverRawFile(state, rawFile) {
      state.protalData.cover.rawFile = rawFile
    },
    updateCoverRawFileShow(state, rawFileShow) {
      state.protalData.cover.rawFileShow = rawFileShow
    },

    // tag
    initTag(state) {
      state.protalData.tag.isShowResult = false
      state.protalData.tag.rawFileShow = false
      state.protalData.tag.percentage = 0
      state.protalData.tag.status = ''
      state.protalData.tag.sceneInSeconds = []
      state.protalData.tag.keyFramesUrl = []
      state.protalData.tag.tags = []
      // state.protalData.tag.videoName = ''
      // state.protalData.tag.videoSize = 0
    },
    updateTagDialogVisible(state, payload) {
      state.protalData.tag.dialogVisible = payload.dialogVisible
    },
    updateTagVideoInfo(state, payload) {
      state.protalData.tag.videoName = payload.name
      state.protalData.tag.videoSize = payload.size
    },
    updateTagVideoTempInfo(state, payload) {
      state.protalData.tag.videoTempName = payload.name
      state.protalData.tag.videoTempSize = payload.size
    },
    // 设置cover上传实例对象
    setTagUploadRef(state, ref) {
      state.protalData.tag.uploadRef = ref
    },
    updateTagProgress(state, percentage) {
      state.protalData.tag.percentage = percentage
    },
    increaseTagProgress(state, percetage) {
      if (state.protalData.tag.percentage < 90) {
        state.protalData.tag.percentage += percetage
      } else if (state.protalData.tag.percentage < 98) {
        state.protalData.tag.percentage += 1
      }
    },
    updateTagSuccess(state, payload) {
      state.protalData.tag.sceneInSeconds = payload.sceneInSeconds
      state.protalData.tag.keyFramesUrl = payload.keyFramesUrl
      state.protalData.tag.tags = payload.tags
      state.protalData.tag.percentage = 100
      state.protalData.tag.status = 'success'
      state.protalData.tag.isShowResult = true
    },
    updateTagError(state) {
      state.protalData.tag.percentage = 100
      state.protalData.tag.status = 'exception'
      state.protalData.tag.isShowResult = false
      state.protalData.tag.sceneInSeconds = []
      state.protalData.tag.keyFramesUrl = []
      state.protalData.tag.tags = []
    },
    updateTagDefaultDialogVisible(state, defaultDialogVisible) {
      state.protalData.tag.defaultDialogVisible = defaultDialogVisible
    },
    updateTagButton(state, payload) {
      state.protalData.tag.uploadDisabled = payload.uploadDisabled
      state.protalData.tag.defaultDisabled = payload.defaultDisabled
    },
    updateTagRawFile(state, rawFile) {
      state.protalData.tag.rawFile = rawFile
    },
    updateTagRawFileShow(state, rawFileShow) {
      state.protalData.tag.rawFileShow = rawFileShow
    },
    updateMlflowYamlString(state, yamlString) {
      state.mlflowData.yamlString = yamlString
    },
    updateMlflowYamlModified(state, isModified) {
      state.mlflowData.isModified = isModified
    }
  }
})
