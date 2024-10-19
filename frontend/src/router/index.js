import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/HomeView.vue'
import { useAuthStore } from '@/stores/auth'
import { checkPermission } from '@/services/permission'
import { useToast } from 'vue-toastification'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    strict: true,
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home,
            meta: {
                layout: {
                    full: true
                }
            }
        },
        {
            path: '/projects',
            name: 'projects',
            components: {
                left: () => import('@/components/FilterItem.vue'),
                default: () => import('@/views/Project/Projects/MainView.vue')
            },
            meta: {
                layout: {
                    full: false
                },
                filterType: 'all'
            }
        },
        {
            path: '/projects/:id',
            name: 'projects.details',
            components: {
                default: () => import('@/views/Project/Details/MainView.vue'),
                right: () => import('@/views/Project/Details/RightSideView.vue')
            }
        },

        {
            path: '/projects/create',
            name: 'projects.create',
            component: () => import('@/views/Project/CreateView.vue'),
            meta: {
                requireAuth: true
            }
        },
        {
            // Kullanıcının sadece kendi projelerini düzenleyebileceği sayfa
            path: '/projects/:id/edit',
            name: 'projects.edit',
            component: () => import('@/views/Project/EditView.vue'),
            meta: {
                requireAuth: true,
                requireOwner: true,
                resource: 'projects'
            }
        },
        {
            // Kullanıcının sadece kendi projelerine gelen başvurularını yönetebileceği sayfa
            path: '/projects/:id/applications',
            name: 'projects.applications',
            component: () => import('@/views/Project/Applications/ApplicationsView.vue'),
            meta: {
                requireAuth: true
            }
        },
        {
            path: '/@:username',
            name: 'user.profile',
            component: () => import('@/views/ProfileView.vue'),
            meta: {
                requireAuth: true
            }
        },
        {
            path: '/@:username/projects',
            name: 'user.projects',
            components: {
                left: () => import('@/components/FilterItem.vue'),
                default: () => import('@/views/Project/UserProjects/MainView.vue'),
                right: () => import('@/views/Project/UserProjects/RightSideView.vue')
            },
            meta: {
                requireAuth: true,
                filterType: 'userProjects'
            }
        },
        {
            path: '/@:username/joined-projects',
            name: 'user.projects.joined',
            components: {
                left: () => import('@/components/FilterItem.vue'),
                default: () => import('@/views/Project/UserJoinedProjects/MainView.vue'),
                right: () => import('@/views/Project/UserJoinedProjects/RightSideView.vue')
            },
            meta: {
                requireAuth: true,
                filterType: 'userJoined'
            }
        },
        {
            path: '/login',
            name: 'login',
            component: () => import('@/views/Auth/LoginView.vue'),
            meta: {
                requireGuest: true,
                layout: {
                    full: true
                }
            }
        },
        {
            path: '/register',
            name: 'register',
            component: () => import('@/views/Auth/RegisterView.vue'),
            meta: {
                requireGuest: true,
                layout: {
                    full: true
                }
            }
        },
        {
            path: '/:pathMatch(.*)*',
            name: 'NotFound',
            component: () => import('@/views/NotFoundView.vue')
        }
    ]
})
router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore()
    const toast = useToast()
    // Sadece misafirler için olan sayfalarda oturum kontrolü
    if (to.meta.requireGuest && authStore.isLoggedIn) {
        return next({ name: 'home' })
    }
    // Oturum gerektiren sayfalarda oturum kontrolü
    if (to.meta.requireAuth && !authStore.isLoggedIn) {
        return next({ name: 'login' })
    }
    if (to.meta.requireOwner) {
        const isOwner = await checkPermission(to.meta.resource, to.params.id)
        if (!isOwner) {
            toast.error('Bu sayfaya erişim yetkiniz yok')
            return next({ name: 'home' })
        }
        return next()
    }
    next()
})
export default router
