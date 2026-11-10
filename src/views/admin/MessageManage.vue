<template>
  <div class="message-manage">
    <div class="page-header">
      <h2 class="page-title">留言管理</h2>
      <div class="header-actions">
        <el-select
          v-model="filter.status"
          placeholder="状态筛选"
          clearable
          style="width: 140px; margin-right: 10px"
          @change="loadData"
        >
          <el-option label="未读" :value="0" />
          <el-option label="已读" :value="1" />
          <el-option label="已回复" :value="2" />
        </el-select>
      </div>
    </div>

    <el-table :data="tableData" v-loading="loading" style="width: 100%">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="name" label="姓名" width="120" />
      <el-table-column prop="email" label="邮箱" width="180" show-overflow-tooltip />
      <el-table-column prop="phone" label="电话" width="140" />
      <el-table-column prop="subject" label="主题" width="180" show-overflow-tooltip />
      <el-table-column prop="message" label="留言内容" show-overflow-tooltip />
      <el-table-column prop="status" label="状态" width="90">
        <template #default="{ row }">
          <el-tag :type="statusTagType(row.status)">
            {{ statusMap[row.status] || '未知' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="时间" width="170" />
      <el-table-column label="操作" width="240" fixed="right">
        <template #default="{ row }">
          <el-button size="small" @click="handleView(row)">查看</el-button>
          <el-button
            size="small"
            type="primary"
            @click="handleReply(row)"
            :disabled="row.status === 2"
          >
            回复
          </el-button>
          <el-button size="small" type="danger" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 查看/回复对话框 -->
    <el-dialog v-model="viewDialogVisible" title="留言详情" width="600px">
      <div class="message-detail" v-if="currentMessage">
        <div class="detail-row">
          <span class="detail-label">姓名：</span>
          <span>{{ currentMessage.name }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">邮箱：</span>
          <span>{{ currentMessage.email }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">电话：</span>
          <span>{{ currentMessage.phone || '未提供' }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">主题：</span>
          <span>{{ currentMessage.subject }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">时间：</span>
          <span>{{ currentMessage.createTime }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">内容：</span>
          <p class="detail-content">{{ currentMessage.message }}</p>
        </div>
        <div class="detail-row" v-if="currentMessage.replyContent">
          <span class="detail-label">回复：</span>
          <p class="detail-content reply-content">{{ currentMessage.replyContent }}</p>
        </div>
      </div>
    </el-dialog>

    <!-- 回复对话框 -->
    <el-dialog v-model="replyDialogVisible" title="回复留言" width="600px">
      <div class="reply-original" v-if="currentMessage">
        <p>
          <strong>{{ currentMessage.name }}</strong>
          说：
        </p>
        <p class="original-content">{{ currentMessage.message }}</p>
      </div>
      <el-form :model="replyForm" ref="replyFormRef" label-width="80px" style="margin-top: 16px">
        <el-form-item
          label="回复内容"
          prop="replyContent"
          :rules="[{ required: true, message: '请输入回复内容', trigger: 'blur' }]"
        >
          <el-input
            v-model="replyForm.replyContent"
            type="textarea"
            :rows="5"
            placeholder="请输入回复内容"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="replyDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSendReply" :loading="sending">发送回复</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
  import { defineComponent, onMounted, reactive, ref } from 'vue'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import {
    getContactMessageList,
    readContactMessage,
    replyContactMessage,
    deleteContactMessage
  } from '@/api/contact'

  export default defineComponent({
    name: 'MessageManage',
    setup() {
      const loading = ref(false)
      const sending = ref(false)
      const viewDialogVisible = ref(false)
      const replyDialogVisible = ref(false)
      const tableData = ref([])
      const currentMessage = ref<any>(null)
      const replyFormRef = ref(null)

      const filter = reactive({ status: null as number | null })

      const replyForm = reactive({
        replyContent: ''
      })

      const statusMap: Record<number, string> = {
        0: '未读',
        1: '已读',
        2: '已回复'
      }

      const statusTagType = (status: number) => {
        switch (status) {
          case 0:
            return 'danger'
          case 1:
            return 'warning'
          case 2:
            return 'success'
          default:
            return 'info'
        }
      }

      const loadData = async () => {
        loading.value = true
        try {
          const params: any = {}
          if (filter.status !== null) {
            params.status = filter.status
          }
          const res = await getContactMessageList(params)
          tableData.value = res.data?.data || res.data || []
        } catch {
          ElMessage.error('加载数据失败')
        } finally {
          loading.value = false
        }
      }

      const handleView = async (row: any) => {
        currentMessage.value = { ...row }
        viewDialogVisible.value = true
        if (row.status === 0) {
          try {
            await readContactMessage(row.id)
            row.status = 1
          } catch {
            // ignore
          }
        }
      }

      const handleReply = (row: any) => {
        currentMessage.value = { ...row }
        replyForm.replyContent = ''
        replyDialogVisible.value = true
      }

      const handleSendReply = async () => {
        const f: any = replyFormRef.value
        if (!f) return
        await f.validate()
        if (!currentMessage.value) return
        sending.value = true
        try {
          await replyContactMessage(currentMessage.value.id, {
            replyContent: replyForm.replyContent
          })
          ElMessage.success('回复成功')
          replyDialogVisible.value = false
          loadData()
        } catch {
          ElMessage.error('回复失败')
        } finally {
          sending.value = false
        }
      }

      const handleDelete = (row: any) => {
        ElMessageBox.confirm('确定删除该留言？删除后不可恢复。', '提示', { type: 'warning' }).then(
          async () => {
            try {
              await deleteContactMessage(row.id)
              ElMessage.success('删除成功')
              loadData()
            } catch {
              ElMessage.error('删除失败')
            }
          }
        )
      }

      onMounted(loadData)

      return {
        loading,
        sending,
        viewDialogVisible,
        replyDialogVisible,
        tableData,
        currentMessage,
        replyFormRef,
        replyForm,
        filter,
        statusMap,
        statusTagType,
        handleView,
        handleReply,
        handleSendReply,
        handleDelete
      }
    }
  })
</script>

<style lang="scss" scoped>
  .message-manage {
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

  .message-detail {
    .detail-row {
      margin-bottom: 14px;
      display: flex;
      align-items: flex-start;
    }
    .detail-label {
      color: #8080b0;
      min-width: 60px;
      flex-shrink: 0;
    }
    .detail-content {
      color: #c0c0e0;
      margin: 0;
      line-height: 1.6;
      white-space: pre-wrap;
    }
    .reply-content {
      color: #7ec8e3;
      background: rgba(30, 60, 100, 0.3);
      padding: 10px;
      border-radius: 6px;
      border-left: 3px solid #4080c0;
    }
  }

  .reply-original {
    background: rgba(20, 20, 50, 0.6);
    padding: 14px;
    border-radius: 8px;
    border: 1px solid rgba(60, 60, 120, 0.3);
    p {
      color: #a0a0c0;
      margin: 0 0 8px;
    }
    .original-content {
      color: #c0c0e0;
      line-height: 1.6;
      white-space: pre-wrap;
    }
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
