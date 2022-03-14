<template>
  <div class="page-wrapper">
    <el-card shadow="never" v-loading="viewLoading">
      <template #header>
        <div class="card-header-wrapper">
          <div class="card-header">{{ pageInfo.pageHeader }}</div>
          <el-button @click="handleRefresh" :icon="Refresh" type="primary"
            >刷新</el-button
          >
        </div>
        <div class="card-extra">
          <p>
            <span>
              {{ pageInfo.startWeek }}
            </span>
            <span> - </span>
            <span> {{ pageInfo.endWeek }} 眼药水阶段 </span>
          </p>

          <p>当前为第{{ pageInfo.week }}周</p>
        </div>
      </template>
      <el-table border :data="dataList">
        <el-table-column
          v-for="column in columns"
          :key="column.key"
          :label="column.title"
          :fixed="isFirshColumn(column.type)"
          :width="isFirshColumn(column.type) ? 100 : 105"
          show-overflow-tooltip
        >
          <template v-slot="{ row, $index }">
            <span v-if="isFirshColumn(column.type)">{{ row[column.key] }}</span>

            <template
              v-if="column.type === EColumnType['checkbox'] && row[column.key]"
            >
              <el-checkbox
                v-model="row[column.key].status"
                :true-label="1"
                :false-label="0"
                @change="handleStatusChange($event, $index, column.key)"
              ></el-checkbox>
              <div class="remark">{{ row[column.key].remark }}</div>
            </template>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script lang="ts">
import { GetUseStatus, SetNoDrop, SetYesDrop } from "@/network/modules/home";
import {
  Column,
  EColumnType,
  ERemindStatus,
  Remind,
  RemindItem,
} from "@/types/modules/home";
import { ElMessageBox } from "element-plus";
import { defineComponent, onMounted, ref } from "vue";
import { Refresh } from "@element-plus/icons-vue";

export default defineComponent({
  name: "Home",
  setup() {
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
      key: keyof RemindItem
    ) => {
      try {
        const id = (dataList.value[index][key] as Remind).id;
        if (checked) {
          await SetYesDrop(id);
        } else {
          await ElMessageBox.confirm(
            "已经滴过眼药水了，确定要取消吗？",
            "提示"
          );
          await SetNoDrop(id);
        }
      } catch (error) {
        (dataList.value[index][key] as Remind).status =
          checked === ERemindStatus["yes"]
            ? ERemindStatus["no"]
            : ERemindStatus["yes"];
      }
    };

    onMounted(() => {
      handleLoadData();
    });
    const handleLoadData = () => {
      viewLoading.value = true;
      GetUseStatus(new Date())
        .then((res) => {
          columns.value = res.data.data.columns;
          dataList.value = res.data.data.rows;
          pageInfo.value = res.data.data.pageInfo;
          setTimeout(() => {
            viewLoading.value = false;
          }, 200);
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
  .remark {
    line-height: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
