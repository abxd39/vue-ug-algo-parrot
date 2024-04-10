<template>
  <Breadcrumb />
  <div class="ua-outer">
    <h2>UA Algorithm Roadmap</h2>
    <div style="text-align: center">
      <img :src="getImgSrc('roadmap.png')" class="road-map" />
    </div>
    <el-divider />
    <el-row :gutter="30" class="ua-gap">
      <el-col :span="8">
        <h2>Automatic Feature Engineering</h2>
        <p>
          Automated feature engineering focuses on using engineering and algorithmic capabilities to efficiently identify the most effective features in massive game logs for improving the prediction
          of models. Previously, manually extracted features were typically 100+ dimensions, while this method can handle the features of games (e.g. HOK, 6000+) in full volume.
        </p>
      </el-col>
      <el-col :span="8">
        <img :src="getImgSrc('automatic.png')" style="width: 100%; margin-top: 20px" />
      </el-col>
      <el-col :span="8">
        <h4>effect</h4>
        <el-table :data="automaticData" stripe style="width: 100%" border size="small">
          <el-table-column prop="setting" label="Contrast settings" width="310" />
          <el-table-column prop="accuracy" label="Top 20% Accuracy" width="130" />
          <el-table-column prop="lift" label="Relative lift" />
        </el-table>
      </el-col>
    </el-row>
    <el-divider />
    <el-row :gutter="30" class="ua-gap">
      <el-col :span="8">
        <h2>Graphical Network Learning</h2>
        <p>
          In addition to macro-statistical class features, the sequence of each user's behavior in the game may contain richer behavioral information. The jumps between different actions of a user in
          a game can be modeled as a graph topology.
        </p>
        <p>The user's behavior is represented as an Action Graph, and then the graph is Embedding encoded as features to improve the prediction of the model.</p>
        <p>There are two types of graphs. A period of time after user registration can be described as a Static Action Graph.By segmenting the time, a Graph Sequence can be obtained.</p>
      </el-col>
      <el-col :span="8">
        <img :src="getImgSrc('graphical.png')" style="width: 100%; margin-top: 20px" />
      </el-col>
      <el-col :span="8">
        <h4>effect</h4>
        <el-table :data="graphicalData" stripe style="width: 100%" border size="small" :cell-style="graphicalCellStyle">
          <el-table-column prop="setting" label="Settings" width="250" />
          <el-table-column prop="roc" label="ROC-AUC" width="150" />
          <el-table-column prop="lift" label="Lift" />
        </el-table>
      </el-col>
    </el-row>
    <el-divider />
    <el-row :gutter="30" class="ua-gap">
      <el-col :span="10">
        <h2>Integration Learning</h2>
        <h4 style="color: #409eff">Ensemble Strategy</h4>
        <p>1. Better model for averaging</p>
        <p>2. base model + lr/mlp</p>
        <p>3. base model + fusion of country, platid and other information + mlp</p>
        <img :src="getImgSrc('integration.png')" style="width: 80%" />
      </el-col>
      <el-col :span="14">
        <h4>effect</h4>
        <el-table :data="integrationData" stripe style="width: 100%" border size="small" :cell-style="integrationCellStyle">
          <el-table-column prop="modelName" label="model name" width="200" />
          <el-table-column prop="versionDes" label="version description" width="300" />
          <el-table-column prop="top005" label="top_005" />
          <el-table-column prop="top020" label="top_020" />
          <el-table-column prop="top005Lift" label="top_005 lift" />
          <el-table-column prop="top002Lift" label="top_020 lift" />
        </el-table>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import Breadcrumb from '@/components/breadcrumb/Breadcrumb.vue'

const getImgSrc = name => {
  return new URL(`../../assets/images/${name}`, import.meta.url).href
}

const automaticData = [
  {
    setting: 'Handcrafted Features (Baseline)',
    accuracy: '33.4%',
    lift: '-'
  },
  {
    setting: 'Automatic Features 6000+',
    accuracy: '33.94%',
    lift: '1.6%'
  },
  {
    setting: 'Handcrafted Features&&Automatic Features 6000+',
    accuracy: '34.39%',
    lift: '3.0%'
  },
  {
    setting: 'Automatic Features Top 200',
    accuracy: '34.24%',
    lift: '2.5%'
  },
  {
    setting: 'Handcrafted Features && Automatic Features Top 200',
    accuracy: '34.47%',
    lift: '3.2%'
  }
]

const graphicalData = [
  {
    setting: 'Macro (baseline)',
    roc: '0.769',
    lift: '-'
  },
  {
    setting: 'Static action graph',
    roc: '0.72',
    lift: '-6.37%'
  },
  {
    setting: 'Graph sequence',
    roc: '0.74',
    lift: '-3.77%'
  },
  {
    setting: 'Macro + static graph',
    roc: '0.771',
    lift: '+0.26%'
  },
  {
    setting: 'Macro + graph sequence',
    roc: '0.771',
    lift: '+0.26%'
  }
]

const integrationData = [
  {
    modelName: 'xgb_r7d',
    versionDes: 'v1:baseline',
    top005: '42.24%',
    top020: '32.85%',
    top005Lift: '/',
    top002Lift: '/'
  },
  {
    modelName: 'xgb_auto_top200_manual',
    versionDes: 'v2:add auto feature',
    top005: '42.91%',
    top020: '33.09%',
    top005Lift: '1.59%',
    top002Lift: '0.73%'
  },
  {
    modelName: 'auto_dnn_r7d',
    versionDes: 'v3:add seq feature and auto feature',
    top005: '43.88%',
    top020: '33.70%',
    top005Lift: '3.88%',
    top002Lift: '2.59%'
  },
  {
    modelName: 'dnn_ensemble_avg_r7d',
    versionDes: 'v4:simple ensemble with simple mlp',
    top005: '44.91%',
    top020: '34.45%',
    top005Lift: '6.32%',
    top002Lift: '4.87%'
  },
  {
    modelName: 'm_retention_wide_deep_rank_v1',
    versionDes: 'v5:add country and cross feature',
    top005: '45.00%',
    top020: '34.09%',
    top005Lift: '6.53%',
    top002Lift: '3.77%'
  },
  {
    modelName: 'm_rank_new_drop_v1',
    versionDes: 'v6:dropout twice',
    top005: '45.40%',
    top020: '34.23%',
    top005Lift: '7.48%',
    top002Lift: '4.20%'
  },
  {
    modelName: 'm_rank_new_drop_rank_v2',
    versionDes: 'v7:ltr:use pairwise',
    top005: '43.87%',
    top020: '34.26%',
    top005Lift: '3.86%',
    top002Lift: '4.29%'
  },
  {
    modelName: 'm_rank_new_drop_rank_v3',
    versionDes: 'v8:ltr:use listwise',
    top005: '45.50%',
    top020: '34.42%',
    top005Lift: '7.72%',
    top002Lift: '4.78%'
  },
  {
    modelName: 'm_rank_new_drop_toppct_v4',
    versionDes: 'v9:rank:contrastive learning',
    top005: '45.51%',
    top020: '34.13%',
    top005Lift: '7.74%',
    top002Lift: '3.90%'
  },
  {
    modelName: 'new_merge_01',
    versionDes: 'v10:四个模型平均[v6-v9]',
    top005: '45.88%',
    top020: '34.65%',
    top005Lift: '8.62%',
    top002Lift: '5.48%'
  },
  {
    modelName: 'new_merge_02',
    versionDes: 'v11:三个模型平均[v6,v8,v9]',
    top005: '45.87%',
    top020: '34.48%',
    top005Lift: '8.59%',
    top002Lift: '4.96%'
  },
  {
    modelName: 'new_merge_03',
    versionDes: 'v12:五个模型平均[v6-v9,v4]',
    top005: '45.82%',
    top020: '34.79%',
    top005Lift: '8.48%',
    top002Lift: '5.91%'
  },
  {
    modelName: 'm_retention_ensemble_v1',
    versionDes: 'v13:添加国家之类的信息+五个打分+mlp[v6-v9,v4]',
    top005: '45.92%',
    top020: '34.72%',
    top005Lift: '8.71%',
    top002Lift: '5.69%'
  },
  {
    modelName: 'm_retention_ensemble_v2',
    versionDes: 'v14:五个打分[26-29,6]/Lr[v6-v9,v4]',
    top005: '45.93%',
    top020: '34.70%',
    top005Lift: '8.74%',
    top002Lift: '5.63%'
  }
]

const graphicalCellStyle = rowObj => {
  // 第三列 lift
  if (rowObj.columnIndex === 2) {
    const num = parseFloat(rowObj.row.lift)
    if (num < 0) {
      return { color: '#F56C6C' }
    }
  }
}

const integrationCellStyle = rowObj => {
  // 第5列和第6列
  if (rowObj.columnIndex === 4) {
    const num = parseFloat(rowObj.row.top005Lift)
    if (num >= 8.6) {
      return { color: '#67C23A' }
    }
  }
  if (rowObj.columnIndex === 5) {
    const num = parseFloat(rowObj.row.top002Lift)
    if (num >= 5.6) {
      return { color: '#67C23A' }
    }
  }
}
</script>

<style lang="less">
.ua-outer {
  padding: 30px;
}
.road-map {
  width: 60%;
  padding-bottom: 20px;
}

.ua-gap {
  margin-top: 20px;
  padding-bottom: 20px;
}
</style>
