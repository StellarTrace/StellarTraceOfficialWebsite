<template>
  <div class="manage-page">
    <div class="page-header">
      <h2 class="page-title">核心技术管理</h2>
      <el-button type="primary" @click="handleAdd">新增</el-button>
    </div>

    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="name" label="技术名称" width="160" />
      <el-table-column prop="description" label="描述" show-overflow-tooltip />
      <el-table-column prop="icon" label="图标" width="100">
        <template #default="{ row }">
          <i :class="['fa', row.icon]" style="font-size:20px;color:#38bdf8"></i>
        </template>
      </el-table-column>
      <el-table-column prop="color_from" label="渐变色" width="160">
        <template #default="{ row }">{{ row.color_from }} → {{ row.color_to }}</template>
      </el-table-column>
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

    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑技术' : '新增技术'" width="500px">
      <el-form :model="form" label-width="100px">
        <el-form-item label="技术名称" required>
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="form.description" type="textarea" :rows="2" />
        </el-form-item>
        <el-form-item label="图标类名">
          <el-input v-model="form.icon" placeholder="如 fa-fire" />
        </el-form-item>
        <el-form-item label="渐变起始色">
          <el-input v-model="form.color_from" placeholder="如 orange-500" />
        </el-form-item>
        <el-form-item label="渐变结束色">
          <el-input v-model="form.color_to" placeholder="如 red-600" />
        </el-form-item>
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
  import { getCoreTechList, addCoreTech, updateCoreTech, deleteCoreTech } from '@/api/coreTech'

  export default defineComponent({
    name: 'CoreTechManage',
    setup() {
      const tableData = ref([])
      const dialogVisible = ref(false)
      const isEdit = ref(false)
      const form = ref<any>({})
      const defaultForm = () => ({
        id: null,
        name: '',
        description: '',
        icon: '',
        color_from: '',
        color_to: '',
        sort_order: 0,
        status: 1
      })

      const loadData = async () => {
        try {
          const res: any = await getCoreTechList()
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
            await updateCoreTech(form.value)
            ElMessage.success('更新成功')
          } else {
            await addCoreTech(form.value)
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
            await deleteCoreTech(row.id)
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
