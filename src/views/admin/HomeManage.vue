<template>
  <div class="manage-page">
    <div class="page-header">
      <h2 class="page-title">首页横幅管理</h2>
      <el-button type="primary" @click="handleAdd">新增</el-button>
    </div>

    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="title" label="主标题" width="150" />
      <el-table-column prop="subtitle" label="副标题" width="150" />
      <el-table-column prop="description" label="描述" show-overflow-tooltip />
      <el-table-column prop="btn_text_1" label="按钮1" width="120" />
      <el-table-column prop="btn_text_2" label="按钮2" width="120" />
      <el-table-column prop="sort_order" label="排序" width="80" />
      <el-table-column prop="status" label="状态" width="80">
        <template #default="{ row }">
          <el-tag :type="row.status === 1 ? 'success' : 'danger'">
            {{ row.status === 1 ? '显示' : '隐藏' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180" fixed="right">
        <template #default="{ row }">
          <el-button size="small" @click="handleEdit(row)">编辑</el-button>
          <el-button size="small" type="danger" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑横幅' : '新增横幅'" width="600px">
      <el-form :model="form" label-width="100px">
        <el-form-item label="主标题" required>
          <el-input v-model="form.title" placeholder="如：星溯智能" />
        </el-form-item>
        <el-form-item label="英文副标题">
          <el-input v-model="form.subtitle" placeholder="如：StellarTrace" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="form.description" type="textarea" :rows="3" />
        </el-form-item>
        <el-form-item label="按钮1文字">
          <el-input v-model="form.btn_text_1" />
        </el-form-item>
        <el-form-item label="按钮1链接">
          <el-input v-model="form.btn_link_1" />
        </el-form-item>
        <el-form-item label="按钮2文字">
          <el-input v-model="form.btn_text_2" />
        </el-form-item>
        <el-form-item label="按钮2链接">
          <el-input v-model="form.btn_link_2" />
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="form.sort_order" :min="0" />
        </el-form-item>
        <el-form-item label="状态">
          <el-switch
            v-model="form.status"
            :active-value="1"
            :inactive-value="0"
            active-text="显示"
            inactive-text="隐藏"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSave">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref, onMounted } from 'vue'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { getHomeBannerList, addHomeBanner, updateHomeBanner, deleteHomeBanner } from '@/api/home'

  export default defineComponent({
    name: 'HomeManage',
    setup() {
      const tableData = ref([])
      const dialogVisible = ref(false)
      const isEdit = ref(false)
      const form = ref<any>({})

      const defaultForm = () => ({
        id: null,
        title: '',
        subtitle: '',
        description: '',
        btn_text_1: '',
        btn_link_1: '',
        btn_text_2: '',
        btn_link_2: '',
        sort_order: 0,
        status: 1
      })

      const loadData = async () => {
        try {
          const res: any = await getHomeBannerList()
          tableData.value = res.data || []
        } catch {
          tableData.value = []
        }
      }

      const handleAdd = () => {
        isEdit.value = false
        form.value = defaultForm()
        dialogVisible.value = true
      }

      const handleEdit = (row: any) => {
        isEdit.value = true
        form.value = { ...row }
        dialogVisible.value = true
      }

      const handleSave = async () => {
        try {
          if (isEdit.value) {
            await updateHomeBanner(form.value)
            ElMessage.success('更新成功')
          } else {
            await addHomeBanner(form.value)
            ElMessage.success('新增成功')
          }
          dialogVisible.value = false
          loadData()
        } catch (e) {
          ElMessage.error(e.message || '操作失败')
        }
      }

      const handleDelete = (row: any) => {
        ElMessageBox.confirm('确认删除该条记录？', '提示', { type: 'warning' })
          .then(async () => {
            await deleteHomeBanner(row.id)
            ElMessage.success('删除成功')
            loadData()
          })
          .catch(() => {
            /* ignore */
          })
      }

      onMounted(loadData)
      return {
        tableData,
        dialogVisible,
        isEdit,
        form,
        handleAdd,
        handleEdit,
        handleSave,
        handleDelete
      }
    }
  })
</script>

<style lang="scss" scoped>
  .manage-page {
    padding: 4px;
  }
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }
  .page-title {
    font-size: 22px;
    font-weight: 700;
    color: #e1e1ff;
    margin: 0;
  }
  :deep(.el-table) {
    --el-table-bg-color: rgba(15, 15, 30, 0.8);
    --el-table-tr-bg-color: rgba(15, 15, 30, 0.6);
    --el-table-header-bg-color: rgba(15, 15, 30, 0.9);
    --el-table-border-color: rgba(255, 255, 255, 0.1);
    --el-table-text-color: #a8a8ff;
    --el-table-header-text-color: #e1e1ff;
  }
  :deep(.el-dialog) {
    background: #0f0f2e;
  }
  :deep(.el-form-item__label) {
    color: #a8a8ff;
  }
  :deep(.el-form-item) {
    overflow: hidden;
  }
  :deep(.el-switch) {
    --el-switch-on-color: #38bdf8;
    --el-switch-off-color: #4a4a6a;
  }
</style>
