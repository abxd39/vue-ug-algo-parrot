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
    const resp = await proxy.$api.cv.nikkeTableauTrust({ "username": "game_ops" })
    if (resp.data == -1) {
        ElMessage.error('request Trust failed')
    }
    ticket.value = resp.data
    embed_link.value = "http://sg-tableau.intlgame.com/trusted/" + ticket.value + "/views/NIKKE_16854361465730/NIKKE?:showAppBanner=false&:embed=yes"
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