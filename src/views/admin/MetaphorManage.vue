<template>
  <div class="manage-page">
    <div class="page-header">
      <h2 class="page-title">意象解析管理</h2>
      <el-button type="primary" @click="handleAdd">新增映射</el-button>
    </div>

    <el-tabs v-model="activeTab" class="dark-tabs">
      <el-tab-pane label="宇宙元素映射" name="metaphor">
        <el-table :data="tableData" border style="width: 100%">
          <el-table-column prop="id" label="ID" width="80" />
          <el-table-column prop="cosmic_element" label="宇宙元素" width="180" />
          <el-table-column prop="tech_mapping" label="技术映射" />
          <el-table-column prop="sort_order" label="排序" width="80" />
          <el-table-column prop="status" label="状态" width="80">
            <template #default="{ row }">
              <el-tag :type="row.status === 1 ? 'success' : 'danger'" size="small">
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
      </el-tab-pane>

      <el-tab-pane label="设计意图" name="design">
        <el-card class="dark-card">
          <el-form :model="designForm" label-width="100px">
            <el-form-item label="标题">
              <el-input v-model="designForm.title" />
            </el-form-item>
            <el-form-item label="内容">
              <el-input v-model="designForm.content" type="textarea" :rows="8" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleSaveDesign">保存设计意图</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-tab-pane>
    </el-tabs>

    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑映射' : '新增映射'" width="500px">
      <el-form :model="form" label-width="100px">
        <el-form-item label="宇宙元素" required>
          <el-input v-model="form.cosmic_element" />
        </el-form-item>
        <el-form-item label="技术映射"><el-input v-model="form.tech_mapping" /></el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="form.sort_order" :min="0" />
        </el-form-item>
        <el-form-item label="状态">
          <el-switch v-model="form.status" :active-value="1" :inactive-value="0" />
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
  import {
    getMetaphorList,
    addMetaphor,
    updateMetaphor,
    deleteMetaphor,
    getMetaphorDesign,
    updateMetaphorDesign
  } from '@/api/metaphor'

  export default defineComponent({
    name: 'MetaphorManage',
    setup() {
      const activeTab = ref('metaphor')
      const tableData = ref([])
      const dialogVisible = ref(false)
      const isEdit = ref(false)
      const form = ref<any>({})
      const designForm = ref<any>({ title: '', content: '' })

      const defaultForm = () => ({
        id: null,
        cosmic_element: '',
        tech_mapping: '',
        sort_order: 0,
        status: 1
      })

      const loadData = async () => {
        try {
          const res: any = await getMetaphorList()
          tableData.value = res.data || []
        } catch {
          tableData.value = []
        }
      }
      const loadDesign = async () => {
        try {
          const res: any = await getMetaphorDesign()
          designForm.value = res.data || { title: '', content: '' }
        } catch {
          /* ignore */
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
            await updateMetaphor(form.value)
            ElMessage.success('更新成功')
          } else {
            await addMetaphor(form.value)
            ElMessage.success('新增成功')
          }
          dialogVisible.value = false
          loadData()
        } catch (e) {
          ElMessage.error(e.message || '操作失败')
        }
      }
      const handleDelete = (row: any) => {
        ElMessageBox.confirm('确认删除？', '提示', { type: 'warning' })
          .then(async () => {
            await deleteMetaphor(row.id)
            ElMessage.success('删除成功')
            loadData()
          })
          .catch(() => {
            /* ignore */
          })
      }
      const handleSaveDesign = async () => {
        try {
          await updateMetaphorDesign(designForm.value)
          ElMessage.success('保存成功')
        } catch (e) {
          ElMessage.error(e.message || '保存失败')
        }
      }

      onMounted(() => {
        loadData()
        loadDesign()
      })
      return {
        activeTab,
        tableData,
        dialogVisible,
        isEdit,
        form,
        designForm,
        handleAdd,
        handleEdit,
        handleSave,
        handleDelete,
        handleSaveDesign
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
  :deep(.el-tabs__item) {
    color: #a8a8ff;
    &.is-active {
      color: #38bdf8;
    }
  }
  :deep(.el-card) {
    background: rgba(15, 15, 30, 0.8);
    border-color: rgba(255, 255, 255, 0.1);
  }
  :deep(.el-form-item) {
    overflow: hidden;
  }
  :deep(.el-switch) {
    --el-switch-on-color: #38bdf8;
    --el-switch-off-color: #4a4a6a;
  }
</style>
