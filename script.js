document.addEventListener('DOMContentLoaded', function () {
    // 【重要】ここにFormspreeの「APIエンドポイント」または「Form ID」を入力してください
    // 例: 'https://formspree.io/f/moqgqyvk'
    const FORMSPREE_URL = 'https://formspree.io/f/YOUR_FORM_ID_HERE';

    const form = document.getElementById('akiya-contact-form');
    const status = document.getElementById('form-status');

    if (form) {
        form.addEventListener('submit', function (event) {
            event.preventDefault(); // 通常のページ遷移を防止

            // プレースホルダーのままであれば警告
            if (FORMSPREE_URL.includes('YOUR_FORM_ID_HERE')) {
                status.textContent = '【設定エラー】JavaScript内のFORMSPREE_URLに正しいForm IDを設定してください。';
                status.className = 'form-status error';
                return;
            }

            const formData = new FormData(form);
            const submitButton = form.querySelector('.btn-submit');
            
            // ボタンを無効化して二重送信を防止
            submitButton.disabled = true;
            submitButton.textContent = '送信中...';

            // Formspreeへ非同期送信
            fetch(FORMSPREE_URL, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                submitButton.disabled = false;
                submitButton.textContent = 'この内容で送信する';
                
                if (response.ok) {
                    status.textContent = 'ありがとうございます。お問い合わせが送信されました。内容を確認のうえ、担当者よりGmail等へご連絡いたします。';
                    status.className = 'form-status success';
                    form.reset(); // フォームをクリア
                } else {
                    response.json().then(data => {
                        if (Object.hasOwn(data, 'errors')) {
                            status.textContent = data['errors'].map(error => error['message']).join(', ');
                        } else {
                            status.textContent = '送信に失敗しました。時間をおいて再度お試しください。';
                        }
                        status.className = 'form-status error';
                    });
                }
            })
            .catch(error => {
                submitButton.disabled = false;
                submitButton.textContent = 'この内容で送信する';
                status.textContent = '通信エラーが発生しました。ネットワーク環境をご確認ください。';
                status.className = 'form-status error';
            });
        });
    }
});
