import { createFileRoute } from "@tanstack/react-router";
import { LegalLayout } from "@/components/legal-layout";

export const Route = createFileRoute("/termos")({
  head: () => ({
    meta: [
      { title: "Termos de Uso — JTC Store" },
      { name: "description", content: "Termos de Uso da JTC Store. Condições para acesso e utilização da nossa plataforma de aplicativos, jogos e livros." },
    ],
  }),
  component: TermosPage,
});

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="font-display text-lg font-semibold tracking-tight">{title}</h2>
      <div className="space-y-3 text-muted-foreground leading-relaxed">{children}</div>
    </section>
  );
}

function TermosPage() {
  return (
    <LegalLayout
      title="Termos de Uso"
      subtitle="JTC Store / Termos"
    >
      <Section title="1. Aceitação dos Termos">
        <p>
          Ao acessar, navegar ou utilizar quaisquer serviços oferecidos pela JTC Store, você concorda em cumprir integralmente estes Termos de Uso, bem como nossa Política de Privacidade. Se não concordar com qualquer disposição aqui estabelecida, não utilize nossa plataforma.
        </p>
        <p>
          Estes termos se aplicam a todo o conteúdo disponibilizado em nossa plataforma, incluindo aplicativos, jogos e livros digitais, sejam desenvolvidos diretamente pela JTC ("Conteúdo Próprio") ou repassados por desenvolvedores, editoras e parceiros ("Conteúdo de Terceiros").
        </p>
      </Section>

      <Section title="2. Descrição do Serviço">
        <p>
          A JTC Store é uma plataforma digital que disponibiliza, organiza e distribui conteúdo digital para seus usuários. Nosso serviço inclui:
        </p>
        <ul className="list-disc list-inside space-y-1 ml-1">
          <li>Catálogo de aplicativos, jogos e livros digitais para download e acesso;</li>
          <li>Sistema de gerenciamento de conteúdo adquirido ou baixado pelo usuário;</li>
          <li>Atualizações de versão para os conteúdos disponibilizados;</li>
          <li>Canal de suporte e comunicação com os usuários;</li>
          <li>Funcionalidades sociais, quando disponíveis, como avaliações e recomendações.</li>
        </ul>
        <p>
          A JTC atua tanto como desenvolvedora e editora de conteúdo próprio quanto como distribuidora de conteúdo de terceiros. O papel da JTC em relação a cada item do catálogo é identificado de forma clara na página de detalhes do respectivo conteúdo.
        </p>
      </Section>

      <Section title="3. Cadastro e Conta do Usuário">
        <p>
          Para acessar determinados recursos da plataforma, você poderá precisar criar uma conta de usuário. Ao se cadastrar, você declara que todas as informações fornecidas são verdadeiras, precisas e completas, e se compromete a mantê-las atualizadas.
        </p>
        <p>
          Você é responsável por manter a confidencialidade de suas credenciais de acesso e por todas as atividades realizadas em sua conta. Notifique-nos imediatamente caso suspeite de uso não autorizado de sua conta.
        </p>
        <p>
          Reservamo-nos o direito de suspender ou encerrar contas que violem estes Termos, que estejam inativas por períodos prolongados ou que apresentem comportamentos considerados fraudulentos ou abusivos.
        </p>
      </Section>

      <Section title="4. Propriedade Intelectual">
        <p>
          Todos os direitos de propriedade intelectual relacionados à plataforma JTC Store — incluindo marca, logotipo, design, interface, software e sistemas — são de propriedade exclusiva da JTC ou de seus licenciadores, protegidos pelas leis brasileiras e internacionais.
        </p>
        <p>
          Em relação ao conteúdo disponibilizado:
        </p>
        <ul className="list-disc list-inside space-y-1 ml-1">
          <li><strong>Conteúdo Próprio:</strong> aplicativos, jogos e livros desenvolvidos pela JTC são de propriedade exclusiva da JTC, e a JTC concede ao usuário uma licença de uso limitada, não exclusiva, não transferível e revogável para uso pessoal e não comercial;</li>
          <li><strong>Conteúdo de Terceiros:</strong> aplicativos, jogos e livros repassados por parceiros permanecem sob a propriedade intelectual de seus respectivos titulares. A JTC atua como intermediária e distribuidora, e a licença de uso é concedida diretamente pelo titular do conteúdo, nos termos específicos de cada item.</li>
        </ul>
        <p>
          É expressamente proibido: copiar, modificar, distribuir, vender, sublicenciar, realizar engenharia reversa, descompilar ou criar obras derivadas de qualquer conteúdo da plataforma, salvo quando expressamente autorizado.
        </p>
      </Section>

      <Section title="5. Licença de Uso do Conteúdo">
        <p>
          Quando você adquire, baixa ou acessa qualquer conteúdo em nossa plataforma, recebe uma licença de uso pessoal, não comercial e intransferível. Essa licença não confere propriedade sobre o conteúdo, apenas o direito de utilizá-lo conforme as condições estabelecidas.
        </p>
        <p>
          Para Conteúdo de Terceiros, a JTC pode repassar os termos de licença específicos do desenvolvedor ou editora. Em caso de conflito entre os termos gerais da JTC Store e os termos específicos do conteúdo de terceiro, prevalecerão os termos específicos para aquele conteúdo.
        </p>
        <p>
          A JTC não se responsabiliza por falhas, bugs ou problemas técnicos presentes em Conteúdo de Terceiros, sendo a responsabilidade de suporte e correção atribuída ao respectivo desenvolvedor ou editora, salvo quando a JTC assumir expressamente tal responsabilidade.
        </p>
      </Section>

      <Section title="6. Condutas Proibidas">
        <p>
          Ao utilizar a JTC Store, você se compromete a não:
        </p>
        <ul className="list-disc list-inside space-y-1 ml-1">
          <li>Violar leis, regulamentos ou direitos de terceiros;</li>
          <li>Utilizar a plataforma para fins ilegais, fraudulentos, ofensivos ou prejudiciais;</li>
          <li>Tentar acessar áreas restritas da plataforma sem autorização;</li>
          <li>Interferir no funcionamento da plataforma, incluindo vírus, malware ou outras tecnologias maliciosas;</li>
          <li>Coletar dados de outros usuários sem autorização;</li>
          <li>Compartilhar, revender, alugar ou distribuir conteúdo adquirido na plataforma sem autorização;</li>
          <li>Utilizar ferramentas automatizadas (bots, scrapers) para acessar ou extrair dados da plataforma;</li>
          <li>Publicar conteúdo falso, enganoso, difamatório ou que viole direitos autorais.</li>
        </ul>
      </Section>

      <Section title="7. Disponibilidade e Modificações do Serviço">
        <p>
          A JTC Store se esforça para manter a plataforma disponível e funcionando adequadamente. No entanto, não garantimos que o serviço será ininterrupto, oportuno, seguro ou livre de erros. Eventuais manutenções, atualizações ou problemas técnicos podem resultar em indisponibilidade temporária.
        </p>
        <p>
          Reservamo-nos o direito de modificar, suspender ou descontinuar qualquer parte do serviço a qualquer momento, com ou sem aviso prévio. Isso inclui a remoção de conteúdo específico do catálogo, seja por decisão da JTC (no caso de Conteúdo Próprio) ou a pedido do titular (no caso de Conteúdo de Terceiros).
        </p>
      </Section>

      <Section title="8. Limitação de Responsabilidade">
        <p>
          Na máxima extensão permitida pela lei aplicável, a JTC não será responsável por:
        </p>
        <ul className="list-disc list-inside space-y-1 ml-1">
          <li>Danos diretos, indiretos, incidentais, especiais ou consequenciais resultantes do uso ou impossibilidade de uso da plataforma;</li>
          <li>Perda de dados, lucros ou oportunidades de negócio;</li>
          <li>Problemas técnicos, falhas de conectividade ou interrupções de serviço fora de nosso controle direto;</li>
          <li>Conflitos de compatibilidade entre o conteúdo disponibilizado e o dispositivo do usuário;</li>
          <li>Ações ou omissões de terceiros, incluindo desenvolvedores e editoras parceiras.</li>
        </ul>
        <p>
          Em relação ao Conteúdo de Terceiros, a JTC atua como mera intermediária e repassa o conteúdo conforme recebido dos parceiros. A JTC não endossa, garante ou se responsabiliza pela qualidade, segurança ou adequação de tais conteúdos, salvo quando assume tal responsabilidade de forma expressa e por escrito.
        </p>
      </Section>

      <Section title="9. Rescisão">
        <p>
          Você pode encerrar sua conta a qualquer momento, seguindo o processo disponível na plataforma ou entrando em contato com nosso suporte.
        </p>
        <p>
          A JTC se reserva o direito de suspender ou encerrar sua conta, bem como revogar seu acesso à plataforma, caso identifique violação destes Termos, comportamento fraudulento, ou por qualquer outro motivo justificado, com ou sem aviso prévio.
        </p>
        <p>
          Após a rescisão, as disposições que, por sua natureza, devam sobreviver à rescisão (como as relativas a propriedade intelectual, limitação de responsabilidade e indenização) permanecerão em vigor.
        </p>
      </Section>

      <Section title="10. Links para Terceiros">
        <p>
          Nossa plataforma pode conter links para websites, serviços ou conteúdos de terceiros. Esses links são fornecidos apenas para conveniência e não implicam endosso, aprovação ou responsabilidade da JTC sobre o conteúdo, práticas ou políticas desses terceiros.
        </p>
        <p>
          Recomendamos que você revise os termos de uso e políticas de privacidade de qualquer site ou serviço de terceiros antes de utilizá-los.
        </p>
      </Section>

      <Section title="11. Legislação Aplicável e Foro">
        <p>
          Estes Termos de Uso são regidos pelas leis da República Federativa do Brasil, independentemente de conflitos de leis.
        </p>
        <p>
          Para resolver quaisquer controvérsias oriundas destes Termos, as partes elegem o foro da Comarca de São Paulo, Estado de São Paulo, com exclusão de qualquer outro, por mais privilegiado que seja.
        </p>
      </Section>

      <Section title="12. Alterações nos Termos">
        <p>
          A JTC pode atualizar estes Termos de Uso periodicamente para refletir mudanças em nossos serviços, na legislação ou em nossas práticas. Notificaremos você sobre alterações significativas por meio de avisos na plataforma ou por outros canais de comunicação.
        </p>
        <p>
          O uso continuado da plataforma após a publicação das alterações constituirá aceitação dos novos termos. Recomendamos que você revise estes Termos regularmente.
        </p>
      </Section>

      <Section title="13. Contato">
        <p>
          Em caso de dúvidas, sugestões ou reclamações sobre estes Termos de Uso ou sobre os serviços da JTC Store, entre em contato conosco:
        </p>
        <ul className="list-disc list-inside space-y-1 ml-1">
          <li><strong>E-mail:</strong> suporte@jtcstore.com.br</li>
          <li><strong>Endereço:</strong> Avenida Paulista, 0000, São Paulo/SP — CEP 01310-100</li>
        </ul>
      </Section>

      <div className="pt-4 text-xs text-muted-foreground">
        Última atualização: {new Date().toLocaleDateString("pt-BR", { day: "numeric", month: "long", year: "numeric" })}
      </div>
    </LegalLayout>
  );
}
