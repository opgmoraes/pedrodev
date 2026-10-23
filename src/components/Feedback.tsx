export function ErrorMessage({ message }: { message: string }) {
  return message ? (
    <div className="system-alert" role="alert">
      {message}
    </div>
  ) : null;
}
export const loadError =
  "Não foi possível carregar os dados. Confira sua conexão e a configuração de acesso e tente novamente.";
export const saveError =
  "Não foi possível salvar. Seus dados continuam no formulário. Tente novamente.";
