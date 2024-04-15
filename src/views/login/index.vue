<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { useRouter } from 'vue-router'
import { adminLoginApi } from '@/api/Admin'
import { useAdminStore } from '@/stores/admin'

const router = useRouter()
const ruleFormRef = ref<FormInstance>()
const adminStore = useAdminStore()
const adminLogin = async () => {
  const res = await adminLoginApi(ruleForm.admin, ruleForm.pass)
  if (res.code !== '1') {
    ElMessage.error(res.msg || '登录失败！')
    return
  }
  // 本地持久化
  adminStore.setAdminInfo(res.data)
  ElMessage.success('登录成功')
  await router.push('/')
}
const validatePass = (rule: any, value: any, callback: any) => {
  // 判断输入的值是否为空
  if (value === '') {
    // 如果为空，则报错
    callback(new Error('请输入密码'))
  } else {
    // 如果输入的值不为空，则判断ruleForm.pass是否为空
    if (ruleForm.pass !== '') {
      // 如果不为空，则判断ruleFormRef.value是否存在
      if (!ruleFormRef.value) return
      // 如果存在，则调用ruleFormRef.value的validateField方法，传入参数pass
      ruleFormRef.value.validateField('pass', () => null)
    }
    // 调用回调函数
    callback()
  }
}

const ruleForm = reactive({
  pass: '',
  admin: '',
})

const rules = reactive<FormRules<typeof ruleForm>>({
  pass: [{ required: true, validator: validatePass, trigger: 'blur' }],
  admin: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
})

const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate(async (valid) => {
    if (valid) {
      //  发送登录请求
      await adminLogin()
    } else {
      ElMessage.error('请输入正确的用户名和密码')
      return false
    }
  })
}

</script>

<template>
  <div class="container">
    <div class="login">
      <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="auto" status-icon style="width: 400px"
        label-position="right">
        <div class="logo">
        </div>
        <el-form-item class="label" label="用户名" prop="admin">
          <el-input v-model="ruleForm.admin" type="text" style="width: 250px" />
        </el-form-item>
        <el-form-item class="label" label="密码" prop="pass">
          <el-input v-model="ruleForm.pass" type="password" style="width: 250px" />
        </el-form-item>
        <el-button color="#39c5bb" style="color: #FFFFFF;width: 250px;margin-left: 60px"
          @click="submitForm(ruleFormRef)">登录</el-button>
      </el-form>

    </div>

  </div>
</template>

<style lang="scss" scoped>
.container {
  display: flex;
  width: 100%;
  height: 100vh;
  justify-content: center;
  align-items: center;
  background-color: $bgcColor;

  .login {
    display: flex;
    align-items: center;
    justify-content: end;
    width: 80%;
    height: 538px;
    background-image: url('@/assets/arctic_fox.jpg');
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    background-size: 100% 100%;
    border-radius: 10px;
    overflow: hidden;

    .el-form {
      display: flex;
      height: 100%;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      color: white;
      background-color: $navBgcColor;
      position: relative;
      backdrop-filter: blur(10px);
      gap: 20px;

      .logo {
        width: 100%;
        height: 95px;
        background-image: url("@/assets/logo.png");
        background-repeat: no-repeat;
        background-size: contain;
        background-position: center;
        position: absolute;
        top: 10%;
      }

      .el-form-item {
        display: flex;
        color: white;
      }

      .el-form-item__label {
        display: flex;
      }
    }
  }

}
</style>