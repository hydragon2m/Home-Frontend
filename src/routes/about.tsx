import { createFileRoute } from '@tanstack/react-router'
import { MainLayout } from '@/layouts/MainLayout'
import { Users, Heart, Shield, Sparkles } from 'lucide-react'

export const Route = createFileRoute('/about')({
  component: AboutPage,
})

function AboutPage() {

  return (
    <MainLayout>
      <div className="container py-16 md:py-24">
        {/* Hero Section */}
        <div className="max-w-3xl mx-auto text-center mb-20 animate-reveal">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 italic text-primary">
            HomieTech Solutions
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Chúng tôi không chỉ xây dựng phần mềm, chúng tôi xây dựng những nhịp cầu gắn kết cho mọi tổ ấm Việt.
          </p>
        </div>

        {/* Our Story */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
          <div className="space-y-6 animate-reveal animate-delay-100">
            <h2 className="text-3xl font-bold">Câu chuyện của chúng tôi</h2>
            <div className="space-y-4 text-lg text-muted-foreground">
              <p>
                Được thành lập vào năm 2026 tại TP. Hà Nội, HomieTech Solutions khởi đầu từ một nhóm kỹ sư và cũng là người bận rộn với cuộc sống. 
                Chúng tôi nhận ra rằng cuộc sống hiện đại đang khiến gia đình chúng ta quá có nhiều việc trong 1 ngày hoặc nhiều ngày, và các công cụ quản lý đang quá phân tán.
              </p>
              <p>
                <b>My Homie</b> ra đời với sứ mệnh trở thành "ngôi nhà số" duy nhất — nơi mọi thành viên có thể cùng nhau chia sẻ chi phí, 
                lên kế hoạch cho những dịp đặc biệt, và giữ cho ngọn lửa hạnh phúc luôn bền vững qua những điều nhỏ nhặt nhất.
              </p>
            </div>
          </div>
          <div className="bg-primary/5 rounded-3xl p-12 flex items-center justify-center animate-reveal animate-delay-200">
            <Sparkles className="w-32 h-32 text-primary/20" />
          </div>
        </div>

        {/* Values */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
          <div className="p-8 rounded-2xl border bg-card animate-reveal animate-delay-100">
            <Users className="w-10 h-10 text-primary mb-4" />
            <h3 className="text-xl font-bold mb-3">Kết nối bền chặt</h3>
            <p className="text-muted-foreground">Mọi tính năng đều được thiết kế để khuyến khích sự tương tác và sẻ chia giữa các thành viên.</p>
          </div>
          <div className="p-8 rounded-2xl border bg-card animate-reveal animate-delay-200">
            <Heart className="w-10 h-10 text-primary mb-4" />
            <h3 className="text-xl font-bold mb-3">Thấu hiểu tổ ấm</h3>
            <p className="text-muted-foreground">Chúng tôi lắng nghe phản hồi từ hàng nghìn gia đình để mang lại trải nghiệm ấm cúng, thân thiện nhất.</p>
          </div>
          <div className="p-8 rounded-2xl border bg-card animate-reveal animate-delay-300">
            <Shield className="w-10 h-10 text-primary mb-4" />
            <h3 className="text-xl font-bold mb-3">Bảo mật tuyệt đối</h3>
            <p className="text-muted-foreground">Dữ liệu gia đình là tài sản quý giá nhất. Chúng tôi cam kết bảo vệ sự riêng tư của bạn như chính gia đình mình.</p>
          </div>
        </div>

        {/* Team Footer */}
        <div className="text-center p-12 rounded-3xl bg-primary text-primary-foreground animate-reveal animate-delay-300">
          <h2 className="text-2xl font-bold mb-4">Bạn đã sẵn sàng để gắn kết hơn?</h2>
          <p className="opacity-90 max-w-xl mx-auto">
            Hãy để HomieTech đồng hành cùng bạn trên hành trình xây dựng một tổ ấm hiện đại, ngăn nắp và tràn đầy hạnh phúc.
          </p>
        </div>
      </div>
    </MainLayout>
  )
}
