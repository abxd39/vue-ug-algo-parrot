<template>
  <Breadcrumb />
  <div class="outer-box" id="opinion">
    <el-tabs v-model="activeName" @tab-click="tabClick">
      <el-tab-pane name="first" label="Sentiment Analysis">
        <SentimentAnalysis />
      </el-tab-pane>
      <el-tab-pane name="second" label="Public Opinion Topic Identification">
        <PublicOpinionTopic />
      </el-tab-pane>
      <el-tab-pane name="third" label="Aspect Based Sentiment Analysis">
        <AspectBasedSentimentAnalysis />
      </el-tab-pane>
      <el-tab-pane name="fourth" label="Read Reviews That Mention" :lazy="true">
        <AspectScore />
      </el-tab-pane>
      <el-tab-pane name="fifth" label="Keyword Extraction">
        <TextExtract />
      </el-tab-pane>
      <el-tab-pane name="sixth" label=" Comment Valid Analysis">
        <CommentValidAnalysis />
      </el-tab-pane>
      <el-tab-pane name="senventh" label="Keywords Cluster">
        <KeywordsCluster />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Breadcrumb from '@/components/breadcrumb/Breadcrumb.vue'
import SentimentAnalysis from '@/components/nlp/SentimentAnalysis.vue'
import PublicOpinionTopic from '@/components/nlp/PublicOpinionTopic.vue'
import AspectBasedSentimentAnalysis from '@/components/nlp/AspectBasedSentimentAnalysis.vue'
import AspectScore from '@/components/nlp/AspectScore.vue'
import TextExtract from '@/components/nlp/TextExtract.vue'
import CommentValidAnalysis from '@/components/nlp/CommentValidAnalysis.vue'
import KeywordsCluster from '@/components/nlp/KeywordsCluster.vue'
import { sendUserAction } from '@/utils/api_utils'

const activeName = ref('first')

const tabClick = context => {
  sendUserAction({ page_name: context.props.label })
}

// onMounted(() => {
//   sendUserAction({ page_name: 'Sentiment Analysis' })
// })
</script>
