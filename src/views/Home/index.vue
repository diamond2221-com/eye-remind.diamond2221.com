<template>
  <div class="page-wrapper">
    <el-card shadow="never" v-loading="viewLoading">
      <template #header>
        <div class="card-header">{{ pageInfo.pageHeader }}</div>
        <p class="card-extra">
          <span>
            {{ pageInfo.startWeek }}
          </span>
          <span> - </span>
          <span>
            {{ pageInfo.endWeek }} 眼药水阶段，当前为第{{ pageInfo.week }}周
          </span>
        </p>
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
              v-if="column.type === EColumnType['checkbox'] && row[column.key]"
              v-model="row[column.key].status"
              :true-label="1"
              :false-label="0"
              @change="handleStatusChange($event, $index, column.key)"
            ></el-checkbox>
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
      viewLoading.value = true;
      GetUseStatus(new Date())
        .then((res) => {
          columns.value = res.data.data.columns;
          dataList.value = res.data.data.list;
          pageInfo.value = res.data.data.pageInfo;
          setTimeout(() => {
            viewLoading.value = false;
          }, 200);
        })
        .catch(() => {
          viewLoading.value = false;
        });
    });

    const isFirshColumn = (type: EColumnType) => type === EColumnType["text"];

    return {
      pageInfo,
      columns,
      dataList,
      viewLoading,
      handleStatusChange,
      EColumnType,
      isFirshColumn,
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
    display: flex;
    align-items: flex-end;
    line-height: 1;
    vertical-align: bottom;
    .card-header {
      font-size: 28px;
      margin-right: 20px;
    }
    .card-extra {
      font-size: 16px;
      color: #333;
    }
  }
}
</style>
