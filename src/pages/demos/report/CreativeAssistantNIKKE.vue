<template>
    <Breadcrumb />
    <iframe :src="embed_link" frameborder="0" width="100%" :height="iframeH"></iframe>
</template>

<script setup>
import { getCurrentInstance, onBeforeMount, onMounted, ref } from 'vue'

import Breadcrumb from '@/components/breadcrumb/Breadcrumb.vue'

let iframeH = ref(document.body.clientHeight)

const ticket = ref("")
const embed_link = ref("")
const { proxy } = getCurrentInstance()


const getEmbedLink = async () => {
    const resp = await proxy.$api.cv.assistantTableauTrust({ username: 'creative_assistant', target_site: 'ComputerVisionAlgorithm' })
    if (resp.data == -1) {
        ElMessage.error('request Trust failed')
    }
    ticket.value = resp.data
    embed_link.value = "https://sg-tableau-new.intlgame.com/trusted/" + ticket.value + "/t/ComputerVisionAlgorithm/views/CreativeAssistantDemo/Overall?:showAppBanner=false&:embed=yes"
    console.log(embed_link)
}

//send trust request, get the ticket key 
onBeforeMount(() => {
    getEmbedLink()
})

onMounted(() => {

    window.onresize = () => {
        iframeH.value = document.body.clientHeight
    }

})

</script>
<style lang="less" scoped></style>