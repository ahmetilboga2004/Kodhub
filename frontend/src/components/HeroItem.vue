<template>
    <div class="hero bg-base-200 min-h-screen rounded-lg">
        <div class="hero-content flex flex-col md:flex-row items-center">
            <div>
                <img src="../assets/cartoon-astronout.png"
                    class="max-w-xs md:max-w-sm transition-transform duration-700 ease-in-out" />
            </div>
            <div class="text-center md:text-left">
                <h1 class="text-6xl font-extrabold">
                    KODHUB</h1>
                <p class="py-6">
                    Fikirlerin gerçeğe dönüşsün! Kodhub'da doğru ekip arkadaşlarını bul, projeni birlikte hayata geçir.
                    Şimdi katıl, başarı yolunda ilk adımı at!
                </p>
                <RouterLink to="/projects" class="btn btn-primary transition-transform duration-700 ease-in-out">
                    Projelere Gözat</RouterLink>
            </div>
        </div>
    </div>

</template>
