<template>
  <Breadcrumb />
  <div class="outer-box" id="comprehension">
    <el-tabs v-model="activeName" @tab-click="tabClick">
      <el-tab-pane name="first" label="Language Recognition">
        <LanguageRecognition />
      </el-tab-pane>
      <el-tab-pane name="second" label="NER" :lazy="true">
        <Ner />
      </el-tab-pane>
      <!-- <el-tab-pane name="third" label="Label System" :lazy="true">
        <LabelSystem />
      </el-tab-pane> -->
      <el-tab-pane name="fourth" label="Game News Headlines Judge" :lazy="true">
        <GameNewsHeadlinesJudge />
      </el-tab-pane>
      <!-- <el-tab-pane name="fifth" label="Multilingual Sentence Representation" :lazy="true">
        <MultilingualSentenceRepresentation />
      </el-tab-pane> -->
      <el-tab-pane name="sixth" label="Comment Effectiveness Analysis" :lazy="true">
        <CommentEffectivenessAnalysis />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Breadcrumb from '@/components/breadcrumb/Breadcrumb.vue'
import LanguageRecognition from '@/components/nlp/LanguageRecognition.vue'
import Ner from '@/components/nlp/Ner.vue'
// import LabelSystem from '@/components/nlp/LabelSystem.vue'
import GameNewsHeadlinesJudge from '@/components/nlp/GameNewsHeadlinesJudge.vue'
// import MultilingualSentenceRepresentation from '@/components/nlp/MultilingualSentenceRepresentation.vue'
import CommentEffectivenessAnalysis from '@/components/nlp/CommentEffectivenessAnalysis.vue'
import { sendUserAction } from '@/utils/api_utils'

const activeName = ref('first')

const tabClick = context => {
  sendUserAction({ page_name: context.props.label })
}
</script>

<style lang="less" scoped></style>
