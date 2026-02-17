import { ShieldCheck, Clock, HeartHandshake } from "lucide-react";

const StudentSolutionSection = () => {
    return (
        <section className="py-24 bg-background">
            <div className="container mx-auto px-6">
                <div className="max-w-3xl mx-auto text-center mb-16">
                    <span className="text-secondary font-bold uppercase tracking-wider text-sm mb-4 block">
                        A SOLUÇÃO
                    </span>
                    <h2 className="text-3xl md:text-5xl font-bold mb-6">
                        A solução? Prática real, <span className="italic text-secondary">todos os dias.</span>
                    </h2>
                    <p className="text-xl text-muted-foreground">
                        Uma IA que se adapta a você e transforma cada minuto em evolução.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-12">
                    <div className="flex flex-col items-center text-center">
                        <div className="w-20 h-20 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 text-blue-500 shadow-[0_0_30px_-5px_rgba(59,130,246,0.3)]">
                            <Clock className="w-10 h-10" />
                        </div>
                        <h3 className="text-xl font-bold mb-3">Tudo no seu tempo</h3>
                        <p className="text-muted-foreground">
                            Você erra. Ajusta. E evolui.
                        </p>
                    </div>

                    <div className="flex flex-col items-center text-center">
                        <div className="w-20 h-20 bg-green-500/10 rounded-2xl flex items-center justify-center mb-6 text-green-500 shadow-[0_0_30px_-5px_rgba(34,197,94,0.3)]">
                            <ShieldCheck className="w-10 h-10" />
                        </div>
                        <h3 className="text-xl font-bold mb-3">Sem julgamento</h3>
                        <p className="text-muted-foreground">
                            Sem julgamento. Teste frases antes de usar na vida real.
                        </p>
                    </div>

                    <div className="flex flex-col items-center text-center">
                        <div className="w-20 h-20 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-6 text-purple-500 shadow-[0_0_30px_-5px_rgba(168,85,247,0.3)]">
                            <HeartHandshake className="w-10 h-10" />
                        </div>
                        <h3 className="text-xl font-bold mb-3">Aqui você pode:</h3>
                        <ul className="text-muted-foreground text-sm space-y-2">
                            <li>Escrever e receber correções claras</li>
                            <li>Treinar pronúncia</li>
                            <li>Explorar vocabulário de forma prática</li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default StudentSolutionSection;
