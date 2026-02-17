import { Brain, MessageCircle, XCircle } from "lucide-react";

const StudentPainSection = () => {
    return (
        <section className="py-24 bg-background relative overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="max-w-3xl mx-auto text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6 italic text-foreground">
                        Se isso já aconteceu com você, <span className="text-secondary">continue lendo:</span>
                    </h2>
                    <div className="mt-8 p-6 bg-card border border-border rounded-xl">
                        <p className="text-lg font-medium text-foreground">
                            O problema não é falta de capacidade. E nem falta de professor.
                        </p>
                        <p className="text-xl font-bold text-primary mt-2">
                            O problema é simples: você pratica pouco entre uma aula e outra.
                        </p>
                        <p className="text-muted-foreground mt-2">
                            E sem prática frequente, a confiança não cresce.
                        </p>
                    </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
                    {[
                        { text: "Você entende a aula, mas na hora de falar trava", icon: XCircle },
                        { text: "Já sabia a resposta, mas ficou em silêncio", icon: MessageCircle },
                        { text: "Sente que evolui devagar porque pratica pouco", icon: Brain },
                        { text: "Só usa o idioma dentro da sala de aula", icon: XCircle }
                    ].map((item, index) => (
                        <div key={index} className="bg-card p-6 rounded-2xl border border-border/50 hover:border-secondary/30 transition-colors group flex items-start gap-4">
                            <div className="w-10 h-10 bg-secondary/10 rounded-xl flex items-center justify-center shrink-0 text-secondary group-hover:scale-110 transition-transform">
                                <item.icon className="w-5 h-5" />
                            </div>
                            <p className="text-lg font-medium text-foreground py-1">{item.text}</p>
                        </div>
                    ))}
                </div>

                <div className="max-w-3xl mx-auto text-center mt-12">
                    <p className="text-xl font-medium text-muted-foreground">
                        O problema não é capacidade. <strong className="text-foreground">É falta de prática consistente.</strong>
                    </p>
                </div>
            </div>
        </section>
    );
};

export default StudentPainSection;
