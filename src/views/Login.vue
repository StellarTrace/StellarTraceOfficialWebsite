<template>
  <div class="login-container">
    <div v-if="pageLoading" class="loading-overlay">
      <div class="planet-loader">
        <div class="planet-sphere"></div>
        <div class="planet-ring ring-1"></div>
        <div class="planet-ring ring-2"></div>
        <div class="planet-ring ring-3"></div>
        <div class="loading-text">
          <span class="loading-dots">
            <span></span>
            <span></span>
            <span></span>
          </span>
        </div>
      </div>
    </div>
    <div id="login-three-container"></div>
    <div class="login-plane">
      <div class="login-plane-container">
        <img class="login-plane-human" src="@/assets/images/login_human.png" alt="" />
        <div class="login-plane-title">
          星溯智能 -- 登陆
          <img
            class="login-plane-title-line"
            src="@/assets/images/login_horizontal_line.png"
            alt=""
          />
        </div>
        <div class="login-plane-form">
          <el-form :model="formField" :rules="formRules" ref="formRef">
            <el-form-item prop="user">
              <el-input placeholder="用户名 / 账号" type="text" v-model="formField.user"></el-input>
            </el-form-item>
            <el-form-item prop="pass">
              <el-input
                placeholder="密码"
                type="password"
                v-model="formField.pass"
                @keyup.enter="submitForm"
              ></el-input>
            </el-form-item>
            <div class="login-code-container">
              <el-form-item style="width: 50%" prop="code">
                <el-input
                  placeholder="验证码"
                  type="text"
                  v-model="formField.code"
                  @keyup.enter="submitForm"
                ></el-input>
              </el-form-item>
              <div @click="getValidateCodeHandle" class="login-code">
                <img :src="codeSrc" v-if="codeSrc" />
                <span v-else class="code-placeholder">点击获取</span>
              </div>
            </div>
            <el-form-item prop="rememberPassword">
              <el-checkbox v-model="formField.rememberPassword" label="记住密码"></el-checkbox>
            </el-form-item>
          </el-form>
          <el-button @click="submitForm" style="width: 100%" type="primary" :loading="loading">
            登录
          </el-button>
        </div>
      </div>
    </div>
    <div class="login-ground"></div>
  </div>
</template>

<script lang="ts">
  import * as THREE from 'three'
  import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
  import { defineComponent, onMounted, onBeforeUnmount, ref, reactive, toRefs, unref } from 'vue'
  import { useRouter } from 'vue-router'
  import { useStore } from 'vuex'
  import _ from 'lodash'
  import { ElMessage } from 'element-plus'
  import { login, getCaptcha } from '@/api/auth'

  export default defineComponent({
    name: 'Login',
    setup() {
      const router = useRouter()
      const store = useStore()
      const loading = ref(false)
      const pageLoading = ref(true)

      // Three.js 相关变量
      let container: any
      let width: number
      let height: number
      const depth = 1400
      let scene: any
      let Sphere_Group: any
      let sphereGeometry: any
      let sphere: any
      let camera: any
      let zAxisNumber: number
      let cameraTarget: any = new THREE.Vector3(0, 0, 0)
      let materials: any = []
      let parameters: any
      let zprogress: number
      let zprogress_second: number
      let particles_first: any[]
      let particles_second: any[]
      let particles_init_position: number
      let cloudParameter_first: any
      let cloudParameter_second: any
      let renderCloudMove_first: any
      let renderCloudMove_second: any
      let renderer: any
      let animateId: number

      const formRef = ref(null)

      const state = reactive({
        codeSrc: '',
        codetoken: ''
      })

      const formField = reactive({
        user: '',
        pass: '',
        code: '',
        rememberPassword: false
      })

      const formRules = {
        user: [{ required: true, message: '请输入用户名账号', trigger: 'blur' }],
        pass: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        code: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
      }

      onMounted(() => {
        // 加载记住的密码
        const remembered = localStorage.getItem('rememberedLogin')
        if (remembered) {
          try {
            const data = JSON.parse(remembered)
            formField.user = data.user || ''
            formField.pass = data.pass || ''
            formField.rememberPassword = true
          } catch {
            localStorage.removeItem('rememberedLogin')
          }
        }

        container = document.getElementById('login-three-container')
        width = container.clientWidth
        height = container.clientHeight
        getValidateCodeHandle()
        initScene()
        initSceneBg()
        initCamera()
        initLight()
        initSphereModal()
        initSphereGroup()
        particles_init_position = -zAxisNumber - depth / 2
        zprogress = particles_init_position
        zprogress_second = particles_init_position * 2
        particles_first = initSceneStar(particles_init_position)
        particles_second = initSceneStar(zprogress_second)
        cloudParameter_first = initTubeRoute(
          [
            new THREE.Vector3(-width / 10, 0, -depth / 2),
            new THREE.Vector3(-width / 4, height / 8, 0),
            new THREE.Vector3(-width / 4, 0, zAxisNumber)
          ],
          400,
          200
        )
        cloudParameter_second = initTubeRoute(
          [
            new THREE.Vector3(width / 8, height / 8, -depth / 2),
            new THREE.Vector3(width / 8, height / 8, zAxisNumber)
          ],
          200,
          100
        )
        initRenderer()
        initOrbitControls()
        animate()

        setTimeout(() => {
          pageLoading.value = false
        }, 1500)
      })

      onBeforeUnmount(() => {
        if (animateId) cancelAnimationFrame(animateId)
        renderer?.dispose()
        scene = null
        camera = null
        renderer = null
      })

      const initScene = () => {
        scene = new THREE.Scene()
        scene.fog = new THREE.Fog(0x000000, 0, 10000)
      }

      const initSceneBg = () => {
        new THREE.TextureLoader().load(require('@/assets/images/sky.png'), (texture) => {
          const geometry = new THREE.BoxGeometry(width, height, depth)
          const material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.BackSide })
          const mesh = new THREE.Mesh(geometry, material)
          scene.add(mesh)
        })
      }

      const initOrbitControls = () => {
        const controls = new OrbitControls(camera, renderer.domElement)
        controls.enabled = false
        controls.update()
      }

      const initCamera = () => {
        const fov = 15
        const distance = width / 2 / Math.tan(Math.PI / 12)
        zAxisNumber = Math.floor(distance - depth / 2)
        camera = new THREE.PerspectiveCamera(fov, width / height, 1, 30000)
        camera.position.set(0, 0, zAxisNumber)
        camera.lookAt(cameraTarget)
      }

      const initLight = () => {
        const ambientLight = new THREE.AmbientLight(0xffffff, 1)
        const light_rightBottom = new THREE.PointLight(0x0655fd, 5, 0)
        light_rightBottom.position.set(0, 100, -200)
        scene.add(light_rightBottom)
        scene.add(ambientLight)
      }

      const initSphereModal = () => {
        let material = new THREE.MeshPhongMaterial()
        material.map = new THREE.TextureLoader().load(require('@/assets/images/earth_bg.png'))
        material.blendDstAlpha = 1
        sphereGeometry = new THREE.SphereGeometry(50, 64, 32)
        sphere = new THREE.Mesh(sphereGeometry, material)
      }

      const initSphereGroup = () => {
        Sphere_Group = new THREE.Group()
        Sphere_Group.add(sphere)
        Sphere_Group.position.x = -400
        Sphere_Group.position.y = 200
        Sphere_Group.position.z = -200
        scene.add(Sphere_Group)
      }

      const initTubeRoute = (route?: any, geometryWidth?: number, geometryHeigh?: number) => {
        const curve = new THREE.CatmullRomCurve3(route, false)
        const tubeGeometry = new THREE.TubeGeometry(curve, 100, 2, 50, false)
        const tubeMaterial = new THREE.MeshBasicMaterial({ opacity: 0, transparent: true })
        const tube = new THREE.Mesh(tubeGeometry, tubeMaterial)
        scene.add(tube)
        const clondGeometry = new THREE.PlaneGeometry(geometryWidth, geometryHeigh)
        const textureLoader = new THREE.TextureLoader()
        const cloudTexture = textureLoader.load(require('@/assets/images/cloud.png'))
        const clondMaterial = new THREE.MeshBasicMaterial({
          map: cloudTexture,
          blending: THREE.AdditiveBlending,
          depthTest: false,
          transparent: true
        })
        const cloud = new THREE.Mesh(clondGeometry, clondMaterial)
        scene.add(cloud)
        return { cloud, curve }
      }

      const initSceneStar = (initZposition: number): any => {
        const geometry = new THREE.BufferGeometry()
        const vertices: number[] = []
        const pointsGeometry: any[] = []
        const textureLoader = new THREE.TextureLoader()
        const sprite1 = textureLoader.load(require('@/assets/images/starflake1.png'))
        const sprite2 = textureLoader.load(require('@/assets/images/starflake2.png'))
        parameters = [
          [[0.6, 100, 0.75], sprite1, 50],
          [[0, 0, 1], sprite2, 20]
        ]
        for (let i = 0; i < 500; i++) {
          const x: number = THREE.MathUtils.randFloatSpread(width)
          const y: number = _.random(0, height / 2)
          const z: number = _.random(-depth / 2, zAxisNumber)
          vertices.push(x, y, z)
        }
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))
        for (let i = 0; i < parameters.length; i++) {
          const color = parameters[i][0]
          const sprite = parameters[i][1]
          const size = parameters[i][2]
          materials[i] = new THREE.PointsMaterial({
            size,
            map: sprite,
            blending: THREE.AdditiveBlending,
            depthTest: true,
            transparent: true
          })
          materials[i].color.setHSL(color[0], color[1], color[2])
          const particles = new THREE.Points(geometry, materials[i])
          particles.rotation.x = Math.random() * 0.2 - 0.15
          particles.rotation.z = Math.random() * 0.2 - 0.15
          particles.rotation.y = Math.random() * 0.2 - 0.15
          particles.position.setZ(initZposition)
          pointsGeometry.push(particles)
          scene.add(particles)
        }
        return pointsGeometry
      }

      const renderSphereRotate = () => {
        if (sphere) Sphere_Group.rotateY(0.001)
      }

      const renderStarMove = () => {
        const time = Date.now() * 0.00005
        zprogress += 1
        zprogress_second += 1
        if (zprogress >= zAxisNumber + depth / 2) {
          zprogress = particles_init_position
        } else {
          particles_first.forEach((item) => {
            item.position.setZ(zprogress)
          })
        }
        if (zprogress_second >= zAxisNumber + depth / 2) {
          zprogress_second = particles_init_position
        } else {
          particles_second.forEach((item) => {
            item.position.setZ(zprogress_second)
          })
        }
        for (let i = 0; i < materials.length; i++) {
          const color = parameters[i][0]
          const h = ((360 * (color[0] + time)) % 360) / 360
          materials[i].color.setHSL(color[0], color[1], parseFloat(h.toFixed(2)))
        }
      }

      const initCloudMove = (
        cloudParameter: any,
        speed: number,
        scaleSpeed = 0.0006,
        maxScale = 1,
        startScale = 0
      ) => {
        let cloudProgress = 0
        return () => {
          if (startScale < maxScale) {
            startScale += scaleSpeed
            cloudParameter.cloud.scale.setScalar(startScale)
          }
          if (cloudProgress > 1) {
            cloudProgress = 0
            startScale = 0
          } else {
            cloudProgress += speed
            if (cloudParameter.curve) {
              const point = cloudParameter.curve.getPoint(cloudProgress)
              if (point && point.x) cloudParameter.cloud.position.set(point.x, point.y, point.z)
            }
          }
        }
      }

      const initRenderer = () => {
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
        renderer.setSize(width, height)
        renderer.shadowMap.enabled = true
        renderer.shadowMap.type = THREE.PCFSoftShadowMap
        container.appendChild(renderer.domElement)
        renderCloudMove_first = initCloudMove(cloudParameter_first, 0.0002)
        renderCloudMove_second = initCloudMove(cloudParameter_second, 0.0008, 0.001)
      }

      const animate = () => {
        animateId = requestAnimationFrame(animate)
        renderSphereRotate()
        renderStarMove()
        renderCloudMove_first()
        renderCloudMove_second()
        renderer.render(scene, camera)
      }

      const getValidateCodeHandle = async () => {
        try {
          const res: any = await getCaptcha()
          if (res.data) {
            state.codeSrc = res.data.image
            state.codetoken = res.data.token
          }
        } catch {
          /* ignore */
        }
      }

      const submitForm = () => {
        const form: any = unref(formRef)
        if (!form) return
        form.validate(async (valid: any) => {
          if (valid) {
            await submitHandle()
          }
        })
      }

      const submitHandle = async () => {
        loading.value = true
        try {
          const res: any = await login({
            username: formField.user,
            password: formField.pass,
            code: formField.code,
            captchaToken: state.codetoken
          })
          if (res.code === 200) {
            if (formField.rememberPassword) {
              localStorage.setItem(
                'rememberedLogin',
                JSON.stringify({
                  user: formField.user,
                  pass: formField.pass
                })
              )
            } else {
              localStorage.removeItem('rememberedLogin')
            }
            store.dispatch('login', {
              token: res.data?.token || '',
              userInfo: res.data?.userInfo || {
                username: formField.user,
                nickname: formField.user,
                role: 'admin'
              }
            })
            ElMessage.success('登录成功')
            router.push('/admin/dashboard')
          } else {
            ElMessage.error(res.message || '登录失败')
            formField.code = ''
            getValidateCodeHandle()
          }
        } catch (e) {
          ElMessage.error(e.message || '登录失败，请检查用户名和密码')
          formField.code = ''
          getValidateCodeHandle()
        } finally {
          loading.value = false
        }
      }

      const refsState = toRefs(state)
      return {
        ...refsState,
        loading,
        pageLoading,
        formRules,
        formField,
        submitForm,
        formRef,
        getValidateCodeHandle
      }
    }
  })
</script>

<style lang="scss" scoped>
  .login-container {
    width: 100%;
    height: 100vh;
    position: relative;
    #login-three-container {
      width: 100%;
      height: 100%;
    }
    .login-plane {
      position: absolute;
      z-index: 9999;
      width: 600px;
      height: 500px;
      background-image: url('~@/assets/images/login_border.png');
      background-repeat: no-repeat;
      background-size: 100% 100%;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      .login-plane-container {
        width: 100%;
        height: 100%;
        border-radius: 18px;
        background-color: #007eff2e;
        position: relative;
        @keyframes humanMove {
          0% {
            top: -100px;
          }
          25% {
            top: -120px;
          }
          50% {
            top: -100px;
          }
          75% {
            top: -80px;
          }
          100% {
            background: -100px;
          }
        }
        .login-plane-human {
          position: absolute;
          width: 260px;
          right: -120px;
          top: -100px;
          animation: humanMove 8s linear 0s infinite normal;
        }
        .login-plane-title {
          width: 100%;
          height: 100px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          font-size: 35px;
          color: #fff;
          font-weight: 700;
          img {
            width: 50%;
          }
          .login-plane-title-line {
            width: 80%;
            position: absolute;
            bottom: 0;
          }
        }
        .login-plane-form {
          padding: 45px 55px;
          box-sizing: border-box;
          .login-code-container {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            .login-code {
              cursor: pointer;
              width: 45%;
              height: 40px;
              background-color: rgba(15, 15, 40, 0.6);
              border: 1px solid rgba(64, 130, 250, 0.4);
              border-radius: 4px;
              display: flex;
              align-items: center;
              justify-content: center;
              img {
                width: 100%;
                height: 100%;
              }
              .code-placeholder {
                font-size: 12px;
                color: #999;
              }
            }
          }
        }
      }
    }
    .login-ground {
      position: absolute;
      z-index: 9998;
      width: 100%;
      height: 400px;
      background-image: url('~@/assets/images/ground.png');
      background-repeat: no-repeat;
      background-size: 100% 100%;
      bottom: 0;
      left: 0;
    }
  }
  .loading-overlay {
    position: fixed;
    inset: 0;
    z-index: 9999;
    background: #050510;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .planet-loader {
    position: relative;
    width: 200px;
    height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .planet-sphere {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    border: 2px solid rgba(99, 102, 241, 0.6);
    background: radial-gradient(circle at 35% 35%, rgba(99, 102, 241, 0.15), transparent 70%);
    animation: planet-pulse 3s ease-in-out infinite;
  }
  .planet-sphere::before {
    content: '';
    position: absolute;
    top: 10%;
    left: 15%;
    width: 30%;
    height: 20%;
    border-radius: 50%;
    background: rgba(99, 102, 241, 0.2);
    filter: blur(4px);
  }
  .planet-ring {
    position: absolute;
    border-radius: 50%;
    border: 1.5px solid transparent;
  }
  .planet-ring.ring-1 {
    width: 160px;
    height: 160px;
    border-top-color: rgba(6, 182, 212, 0.7);
    border-right-color: rgba(6, 182, 212, 0.3);
    animation: planet-spin 2s linear infinite;
  }
  .planet-ring.ring-2 {
    width: 180px;
    height: 180px;
    border-bottom-color: rgba(217, 70, 239, 0.6);
    border-left-color: rgba(217, 70, 239, 0.2);
    animation: planet-spin 3s linear infinite reverse;
  }
  .planet-ring.ring-3 {
    width: 200px;
    height: 200px;
    border-top-color: rgba(56, 189, 248, 0.4);
    border-bottom-color: rgba(56, 189, 248, 0.4);
    animation: planet-spin 4s linear infinite;
  }
  .loading-text {
    position: absolute;
    bottom: -50px;
    left: 50%;
    transform: translateX(-50%);
    white-space: nowrap;
  }
  .loading-dots {
    display: flex;
    gap: 6px;
  }
  .loading-dots span {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #38bdf8;
    animation: dot-bounce 1.4s ease-in-out infinite;
  }
  .loading-dots span:nth-child(2) {
    animation-delay: 0.2s;
  }
  .loading-dots span:nth-child(3) {
    animation-delay: 0.4s;
  }
  @keyframes planet-spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  @keyframes planet-pulse {
    0%,
    100% {
      box-shadow: 0 0 20px rgba(99, 102, 241, 0.3), inset 0 0 20px rgba(99, 102, 241, 0.1);
    }
    50% {
      box-shadow: 0 0 40px rgba(99, 102, 241, 0.5), inset 0 0 30px rgba(99, 102, 241, 0.2);
    }
  }
  @keyframes dot-bounce {
    0%,
    80%,
    100% {
      transform: scale(0.4);
      opacity: 0.4;
    }
    40% {
      transform: scale(1);
      opacity: 1;
    }
  }
</style>
