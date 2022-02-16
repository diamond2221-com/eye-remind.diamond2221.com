<template>
  <div class="page-wrapper">
    <el-card shadow="never" v-loading="viewLoading">
      <template #header>
        <div class="card-header-wrapper">
          <div class="card-header">{{ pageInfo.pageHeader }}</div>
          <el-button @click="handleRefresh" :icon="Refresh" type="primary">
            刷新
          </el-button>
        </div>
        <div class="card-extra">
          <p>
            <span>
              {{ pageInfo.startWeek }}
            </span>
            <span> - </span>
            <span> {{ pageInfo.endWeek }} 眼药水阶段 </span>
          </p>

          <p>当前选择的为第{{ pageInfo.week }}周</p>
        </div>
      </template>
      <el-table border :data="dataList">
        <el-table-column
          v-for="column in columns"
          :key="column.key"
          :label="column.title"
          :fixed="isFirshColumn(column.type)"
          :width="isFirshColumn(column.type) ? 100 : 100"
        >
          <template v-slot="{ row, $index }">
            <span v-if="isFirshColumn(column.type)">{{ row[column.key] }}</span>

            <el-checkbox
              v-if="column.type === EColumnType['checkbox']"
              :checked="!!row[column.key]"
              :true-label="1"
              :false-label="0"
              @change="handleStatusChange($event, $index, column)"
            ></el-checkbox>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script lang="ts">
import { GetRemindAll, SetDropTime } from "@/network/modules/set";
import {
  Column,
  EColumnType,
  ERemindStatus,
  RemindItem,
  SetRemindData,
} from "@/types/modules/home";
import { defineComponent, onMounted, ref } from "vue";
import { Refresh } from "@element-plus/icons-vue";

export default defineComponent({
  name: "Set",
  setup() {
    const nowDate = ref<Date>(new Date());
    const pageInfo = ref({
      pageHeader: "",
      startWeek: "",
      endWeek: "",
      week: "",
    });
    const columns = ref<Column[]>([]);
    const dataList = ref<RemindItem[]>([]);
    const viewLoading = ref(false);

    const handleStatusChange = async (
      checked: 0 | 1,
      index: number,
      column: Column
    ) => {
      try {
        // const remind = dataList.value[index][column] as Remind;
        const status = dataList.value[index][column.key]
          ? ERemindStatus["no"]
          : ERemindStatus["yes"];
        const date = new Date(nowDate.value.getTime());
        const data: SetRemindData = {
          timeId: column.id,
          medicineId: dataList.value[index].medicineId,
          status,
          date,
        };
        await SetDropTime(data);
        handleRefresh();
      } catch (error) {
        //
      }
    };

    onMounted(() => {
      handleLoadData();
    });
    const handleLoadData = () => {
      viewLoading.value = true;
      const date = new Date(nowDate.value.getTime());
      GetRemindAll(date)
        .then((res) => {
          columns.value = res.data.data.columns;
          dataList.value = res.data.data.rows;
          pageInfo.value = res.data.data.pageInfo;
          viewLoading.value = false;
        })
        .catch(() => {
          viewLoading.value = false;
        });
    };

    const isFirshColumn = (type: EColumnType) => type === EColumnType["text"];

    const handleRefresh = () => {
      handleLoadData();
    };

    return {
      pageInfo,
      columns,
      dataList,
      viewLoading,
      handleStatusChange,
      EColumnType,
      isFirshColumn,
      Refresh,
      handleRefresh,
    };
  },
});
</script>

<style lang="scss" scoped>
.page-wrapper {
  /* padding: 2vh 3vw; */
  /deep/ .el-card__header {
    padding-top: 2vmin;
    padding-bottom: 2vmin;
    /* display: flex;
    align-items: flex-end; */
    line-height: 1;
    vertical-align: bottom;
    .card-header-wrapper {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .card-header {
        font-size: 28px;
        margin-right: 20px;
        line-height: 1.8;
      }
    }
    .card-extra {
      font-size: 16px;
      color: #333;
      line-height: 1.5;
    }
  }
}
</style>
