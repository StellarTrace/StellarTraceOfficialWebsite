<template>
  <div class="contact-manage">
    <div class="page-header">
      <h2 class="page-title">联系我们 - 信息管理</h2>
      <el-button type="primary" @click="handleAdd">新增联系方式</el-button>
    </div>

    <el-table :data="tableData" v-loading="loading" style="width: 100%">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="type" label="类型" width="120">
        <template #default="{ row }">
          <el-tag>{{ typeMap[row.type] || row.type }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="icon" label="图标" width="100">
        <template #default="{ row }">
          <span style="font-size: 20px">{{ row.icon }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="label" label="标签" width="120" />
      <el-table-column prop="value" label="值" />
      <el-table-column prop="link" label="链接" width="200" show-overflow-tooltip />
      <el-table-column prop="sortOrder" label="排序" width="80" />
      <el-table-column prop="status" label="状态" width="80">
        <template #default="{ row }">
          <el-tag :type="row.status === 1 ? 'success' : 'info'">
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

    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑联系方式' : '新增联系方式'"
      width="500px"
    >
      <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
        <el-form-item label="类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择类型">
            <el-option label="电话" value="phone" />
            <el-option label="邮箱" value="email" />
            <el-option label="地址" value="address" />
            <el-option label="微信" value="wechat" />
            <el-option label="其他" value="other" />
          </el-select>
        </el-form-item>
        <el-form-item label="图标" prop="icon">
          <el-input v-model="form.icon" placeholder="如 ✉ 📞 📍" />
        </el-form-item>
        <el-form-item label="标签" prop="label">
          <el-input v-model="form.label" placeholder="如：联系电话" />
        </el-form-item>
        <el-form-item label="值" prop="value">
          <el-input v-model="form.value" placeholder="如：400-888-8888" />
        </el-form-item>
        <el-form-item label="链接">
          <el-input v-model="form.link" placeholder="如：tel:400-888-8888" />
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="form.sortOrder" :min="0" :max="999" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio :label="1">显示</el-radio>
            <el-radio :label="0">隐藏</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSave" :loading="saving">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
  import { defineComponent, onMounted, reactive, ref } from 'vue'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import {
    getContactInfoList,
    addContactInfo,
    updateContactInfo,
    deleteContactInfo
  } from '@/api/contact'

  export default defineComponent({
    name: 'ContactManage',
    setup() {
      const loading = ref(false)
      const saving = ref(false)
      const dialogVisible = ref(false)
      const isEdit = ref(false)
      const tableData = ref([])
      const formRef = ref(null)

      const typeMap: Record<string, string> = {
        phone: '电话',
        email: '邮箱',
        address: '地址',
        wechat: '微信',
        other: '其他'
      }

      const defaultForm = {
        id: null as number | null,
        type: 'phone',
        icon: '',
        label: '',
        value: '',
        link: '',
        sortOrder: 0,
        status: 1
      }

      const form = reactive({ ...defaultForm })

      const rules = {
        type: [{ required: true, message: '请选择类型', trigger: 'change' }],
        label: [{ required: true, message: '请输入标签', trigger: 'blur' }],
        value: [{ required: true, message: '请输入值', trigger: 'blur' }]
      }

      const loadData = async () => {
        loading.value = true
        try {
          const res = await getContactInfoList()
          tableData.value = res.data?.data || res.data || []
        } catch {
          ElMessage.error('加载数据失败')
        } finally {
          loading.value = false
        }
      }

      const handleAdd = () => {
        isEdit.value = false
        Object.assign(form, defaultForm)
        dialogVisible.value = true
      }

      const handleEdit = (row: any) => {
        isEdit.value = true
        Object.assign(form, row)
        dialogVisible.value = true
      }

      const handleSave = async () => {
        const f: any = formRef.value
        if (!f) return
        await f.validate()
        saving.value = true
        try {
          if (isEdit.value) {
            await updateContactInfo(form)
          } else {
            await addContactInfo(form)
          }
          ElMessage.success('保存成功')
          dialogVisible.value = false
          loadData()
        } catch {
          ElMessage.error('保存失败')
        } finally {
          saving.value = false
        }
      }

      const handleDelete = (row: any) => {
        ElMessageBox.confirm('确定删除该联系方式？', '提示', { type: 'warning' }).then(async () => {
          try {
            await deleteContactInfo(row.id)
            ElMessage.success('删除成功')
            loadData()
          } catch {
            ElMessage.error('删除失败')
          }
        })
      }

      onMounted(loadData)

      return {
        loading,
        saving,
        dialogVisible,
        isEdit,
        tableData,
        formRef,
        form,
        rules,
        typeMap,
        handleAdd,
        handleEdit,
        handleSave,
        handleDelete
      }
    }
  })
</script>

<style lang="scss" scoped>
  .contact-manage {
    padding: 20px;
  }
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }
  .page-title {
    color: #e0e0ff;
    font-size: 20px;
    margin: 0;
  }
  :deep(.el-table) {
    --el-table-bg-color: rgba(15, 15, 40, 0.8);
    --el-table-tr-bg-color: rgba(15, 15, 40, 0.6);
    --el-table-header-bg-color: rgba(20, 20, 50, 0.9);
    --el-table-row-hover-bg-color: rgba(30, 30, 80, 0.6);
    --el-table-text-color: #c0c0e0;
    --el-table-header-text-color: #e0e0ff;
    --el-table-border-color: rgba(60, 60, 120, 0.3);
  }
  :deep(.el-dialog) {
    background: #0f0f2e;
    border: 1px solid rgba(60, 60, 120, 0.3);
    .el-dialog__title {
      color: #e0e0ff;
    }
    .el-form-item__label {
      color: #a0a0c0;
    }
  }
</style>
