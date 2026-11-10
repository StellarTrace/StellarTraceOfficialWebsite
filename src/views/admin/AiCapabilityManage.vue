<template>
  <div class="manage-page">
    <div class="page-header">
      <h2 class="page-title">星际AI能力管理</h2>
      <el-button type="primary" @click="handleAdd">新增能力</el-button>
    </div>

    <el-tabs v-model="activeTab" class="dark-tabs">
      <el-tab-pane label="AI能力列表" name="capability">
        <el-table :data="capabilityData" border style="width: 100%">
          <el-table-column prop="id" label="ID" width="80" />
          <el-table-column prop="name" label="能力名称" width="160" />
          <el-table-column prop="description" label="描述" show-overflow-tooltip />
          <el-table-column prop="icon" label="图标" width="80">
            <template #default="{ row }">
              <i :class="['fa', row.icon]" style="font-size:18px;color:#d946ef"></i>
            </template>
          </el-table-column>
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
              <el-button size="small" @click="handleEditCap(row)">编辑</el-button>
              <el-button size="small" type="danger" @click="handleDeleteCap(row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>

      <el-tab-pane label="数据看板" name="dashboard">
        <div style="margin-bottom: 16px; text-align: right;">
          <el-button type="primary" @click="handleAddDash">新增指标</el-button>
        </div>
        <el-table :data="dashboardData" border style="width: 100%">
          <el-table-column prop="id" label="ID" width="80" />
          <el-table-column prop="value" label="数值" width="120" />
          <el-table-column prop="label" label="标签" />
          <el-table-column prop="color" label="颜色" width="140" />
          <el-table-column prop="sort_order" label="排序" width="80" />
          <el-table-column label="操作" width="180" fixed="right">
            <template #default="{ row }">
              <el-button size="small" @click="handleEditDash(row)">编辑</el-button>
              <el-button size="small" type="danger" @click="handleDeleteDash(row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>

      <el-tab-pane label="回答模板" name="reply">
        <div style="margin-bottom: 16px; text-align: right;">
          <el-button type="primary" @click="handleAddReply">新增模板</el-button>
        </div>
        <el-table :data="replyData" border style="width: 100%">
          <el-table-column prop="id" label="ID" width="80" />
          <el-table-column prop="keyword" label="关键词" width="120">
            <template #default="{ row }">
              <el-tag v-if="row.keyword" size="small">{{ row.keyword }}</el-tag>
              <span v-else style="color: #999">默认回复</span>
            </template>
          </el-table-column>
          <el-table-column prop="reply" label="回复内容" show-overflow-tooltip />
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
              <el-button size="small" @click="handleEditReply(row)">编辑</el-button>
              <el-button size="small" type="danger" @click="handleDeleteReply(row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>

    <!-- 能力对话框 -->
    <el-dialog v-model="capDialogVisible" :title="isEdit ? '编辑能力' : '新增能力'" width="500px">
      <el-form :model="capForm" label-width="100px">
        <el-form-item label="能力名称" required><el-input v-model="capForm.name" /></el-form-item>
        <el-form-item label="描述">
          <el-input v-model="capForm.description" type="textarea" :rows="2" />
        </el-form-item>
        <el-form-item label="图标类名">
          <el-input v-model="capForm.icon" placeholder="如 fa-code" />
        </el-form-item>
        <el-form-item label="渐变起始色"><el-input v-model="capForm.color_from" /></el-form-item>
        <el-form-item label="渐变结束色"><el-input v-model="capForm.color_to" /></el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="capForm.sort_order" :min="0" />
        </el-form-item>
        <el-form-item label="状态">
          <el-switch v-model="capForm.status" :active-value="1" :inactive-value="0" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="capDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSaveCap">保存</el-button>
      </template>
    </el-dialog>

    <!-- 看板对话框 -->
    <el-dialog v-model="dashDialogVisible" :title="isEdit ? '编辑指标' : '新增指标'" width="500px">
      <el-form :model="dashForm" label-width="100px">
        <el-form-item label="数值" required>
          <el-input v-model="dashForm.value" placeholder="如 138、2T+" />
        </el-form-item>
        <el-form-item label="标签"><el-input v-model="dashForm.label" /></el-form-item>
        <el-form-item label="颜色">
          <el-input v-model="dashForm.color" placeholder="如 stardust-400" />
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="dashForm.sort_order" :min="0" />
        </el-form-item>
        <el-form-item label="状态">
          <el-switch v-model="dashForm.status" :active-value="1" :inactive-value="0" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dashDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSaveDash">保存</el-button>
      </template>
    </el-dialog>

    <!-- 回答模板对话框 -->
    <el-dialog v-model="replyDialogVisible" :title="isEdit ? '编辑模板' : '新增模板'" width="600px">
      <el-form :model="replyForm" label-width="100px">
        <el-form-item label="关键词">
          <el-input v-model="replyForm.keyword" placeholder="留空则为默认回复" />
        </el-form-item>
        <el-form-item label="回复内容" required>
          <el-input v-model="replyForm.reply" type="textarea" :rows="4" />
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="replyForm.sort_order" :min="0" />
        </el-form-item>
        <el-form-item label="状态">
          <el-switch v-model="replyForm.status" :active-value="1" :inactive-value="0" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="replyDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSaveReply">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref, onMounted } from 'vue'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import {
    getAiCapabilityList,
    addAiCapability,
    updateAiCapability,
    deleteAiCapability,
    getAiDashboardList,
    addAiDashboard,
    updateAiDashboard,
    deleteAiDashboard
  } from '@/api/aiCapability'
  import {
    getAiReplyTemplateList,
    addAiReplyTemplate,
    updateAiReplyTemplate,
    deleteAiReplyTemplate
  } from '@/api/aiReplyTemplate'

  export default defineComponent({
    name: 'AiCapabilityManage',
    setup() {
      const activeTab = ref('capability')
      const capabilityData = ref([])
      const dashboardData = ref([])
      const replyData = ref([])
      const capDialogVisible = ref(false)
      const dashDialogVisible = ref(false)
      const replyDialogVisible = ref(false)
      const isEdit = ref(false)
      const capForm = ref<any>({})
      const dashForm = ref<any>({})
      const replyForm = ref<any>({})

      const defaultCap = () => ({
        id: null,
        name: '',
        description: '',
        icon: '',
        color_from: '',
        color_to: '',
        sort_order: 0,
        status: 1
      })
      const defaultDash = () => ({
        id: null,
        value: '',
        label: '',
        color: '',
        sort_order: 0,
        status: 1
      })
      const defaultReply = () => ({
        id: null,
        keyword: '',
        reply: '',
        sort_order: 0,
        status: 1
      })

      const loadCap = async () => {
        try {
          const res: any = await getAiCapabilityList()
          capabilityData.value = res.data || []
        } catch {
          capabilityData.value = []
        }
      }
      const loadDash = async () => {
        try {
          const res: any = await getAiDashboardList()
          dashboardData.value = res.data || []
        } catch {
          dashboardData.value = []
        }
      }
      const loadReply = async () => {
        try {
          const res: any = await getAiReplyTemplateList()
          replyData.value = res.data || []
        } catch {
          replyData.value = []
        }
      }

      const handleAdd = () => {
        isEdit.value = false
        capForm.value = defaultCap()
        capDialogVisible.value = true
      }
      const handleEditCap = (row: any) => {
        isEdit.value = true
        capForm.value = { ...row }
        capDialogVisible.value = true
      }
      const handleSaveCap = async () => {
        try {
          if (isEdit.value) {
            await updateAiCapability(capForm.value)
            ElMessage.success('更新成功')
          } else {
            await addAiCapability(capForm.value)
            ElMessage.success('新增成功')
          }
          capDialogVisible.value = false
          loadCap()
        } catch (e) {
          ElMessage.error(e.message || '操作失败')
        }
      }
      const handleDeleteCap = (row: any) => {
        ElMessageBox.confirm('确认删除？', '提示', { type: 'warning' })
          .then(async () => {
            await deleteAiCapability(row.id)
            ElMessage.success('删除成功')
            loadCap()
          })
          .catch(() => {
            /* ignore */
          })
      }

      const handleAddDash = () => {
        isEdit.value = false
        dashForm.value = defaultDash()
        dashDialogVisible.value = true
      }
      const handleEditDash = (row: any) => {
        isEdit.value = true
        dashForm.value = { ...row }
        dashDialogVisible.value = true
      }
      const handleSaveDash = async () => {
        try {
          if (isEdit.value) {
            await updateAiDashboard(dashForm.value)
            ElMessage.success('更新成功')
          } else {
            await addAiDashboard(dashForm.value)
            ElMessage.success('新增成功')
          }
          dashDialogVisible.value = false
          loadDash()
        } catch (e) {
          ElMessage.error(e.message || '操作失败')
        }
      }
      const handleDeleteDash = (row: any) => {
        ElMessageBox.confirm('确认删除？', '提示', { type: 'warning' })
          .then(async () => {
            await deleteAiDashboard(row.id)
            ElMessage.success('删除成功')
            loadDash()
          })
          .catch(() => {
            /* ignore */
          })
      }

      const handleAddReply = () => {
        isEdit.value = false
        replyForm.value = defaultReply()
        replyDialogVisible.value = true
      }
      const handleEditReply = (row: any) => {
        isEdit.value = true
        replyForm.value = { ...row }
        replyDialogVisible.value = true
      }
      const handleSaveReply = async () => {
        try {
          if (isEdit.value) {
            await updateAiReplyTemplate(replyForm.value)
            ElMessage.success('更新成功')
          } else {
            await addAiReplyTemplate(replyForm.value)
            ElMessage.success('新增成功')
          }
          replyDialogVisible.value = false
          loadReply()
        } catch (e) {
          ElMessage.error(e.message || '操作失败')
        }
      }
      const handleDeleteReply = (row: any) => {
        ElMessageBox.confirm('确认删除？', '提示', { type: 'warning' })
          .then(async () => {
            await deleteAiReplyTemplate(row.id)
            ElMessage.success('删除成功')
            loadReply()
          })
          .catch(() => {
            /* ignore */
          })
      }

      onMounted(() => {
        loadCap()
        loadDash()
        loadReply()
      })
      return {
        activeTab,
        capabilityData,
        dashboardData,
        replyData,
        capDialogVisible,
        dashDialogVisible,
        replyDialogVisible,
        isEdit,
        capForm,
        dashForm,
        replyForm,
        handleAdd,
        handleEditCap,
        handleSaveCap,
        handleDeleteCap,
        handleAddDash,
        handleEditDash,
        handleSaveDash,
        handleDeleteDash,
        handleAddReply,
        handleEditReply,
        handleSaveReply,
        handleDeleteReply
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
  :deep(.el-form-item) {
    overflow: hidden;
  }
  :deep(.el-switch) {
    --el-switch-on-color: #38bdf8;
    --el-switch-off-color: #4a4a6a;
  }
</style>
