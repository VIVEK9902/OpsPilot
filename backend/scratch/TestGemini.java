import com.google.genai.Client;
import com.google.genai.types.GenerateContentConfig;
import com.google.genai.types.GenerateContentResponse;
import com.google.genai.types.Content;
import com.google.genai.types.Part;

public class TestGemini {
    public static void main(String[] args) throws Exception {
        try {
            Client client = Client.builder().apiKey("dummy").build();
            var chat = client.chats().create("gemini-3.5-flash");
            System.out.println("Chat created!");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
