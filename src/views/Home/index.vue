<template>
  <div class="page-wrapper">
    <el-card :header="pageHeader">
      <el-table border :data="dataList">
        <el-table-column
          v-for="column in columns"
          :key="column.key"
          :label="column.title"
        >
          <template v-slot="{ row, $index }">
            <span v-if="column.type === EColumnType['text']">{{
              row[column.key]
            }}</span>
            <el-checkbox
              v-if="column.type === EColumnType['checkbox']"
              v-model="row[column.key]"
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
import { GetUseStatus, SetNoDrop, SetToDrop } from "@/network/modules/home";
import { formatDate } from "@/utils/date";
import { computed, defineComponent, onMounted, ref } from "vue";
import {
  Column,
  RemindItem,
  EColumnType,
  ERemindStatus,
} from "@/types/modules/home";
import { ElMessageBox } from "element-plus";

export default defineComponent({
  name: "Home",
  setup() {
    const pageHeader = computed(() => {
      return `${formatDate(new Date(), "M月d日")} 用药时间`;
    });
    const columns = ref<Column[]>([
      {
        key: "name",
        title: "药品名/时间",
        type: EColumnType["text"],
      },
      {
        key: "time1",
        title: "早上起床",
        type: EColumnType["checkbox"],
      },
    ]);
    const dataList = ref<RemindItem[]>([
      {
        name: "典必殊",
        time1: 1,
      },
    ]);

    const handleStatusChange = async (
      checked: 0 | 1,
      index: number,
      key: keyof RemindItem
    ) => {
      try {
        if (checked) {
          await SetToDrop();
        } else {
          await ElMessageBox.confirm(
            "已经滴过眼药水了，确定要取消吗？",
            "提示"
          );
          await SetNoDrop();
        }
      } catch (error) {
        dataList.value[index][key] =
          checked === ERemindStatus["yes"]
            ? ERemindStatus["no"]
            : ERemindStatus["yes"];
      }
    };

    onMounted(() => {
      GetUseStatus().then((res) => {
        console.log(res);
      });
    });

    return {
      pageHeader,
      columns,
      dataList,
      handleStatusChange,
      EColumnType,
    };
  },
});
</script>

<style lang="scss" scoped>
.page-wrapper {
  padding: 20px;
}
</style>
