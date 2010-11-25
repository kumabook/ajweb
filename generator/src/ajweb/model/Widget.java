package ajweb.model;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import org.eclipse.jetty.util.ajax.JSON;
import ajweb.utils.Template;

public class Widget implements AbstractModel{
	public String name;
	public String type;
	public ArrayList<Widget> children = new ArrayList<Widget>();
	public ArrayList<Event> events = new ArrayList<Event>();
	public HashMap<String , Object> properties = new HashMap<String, Object>();
	
	public static ArrayList<String> widgets = new ArrayList<String>();
	static {
		widgets.add("button");
		widgets.add("table");
		widgets.add("th");
		widgets.add("label");
		widgets.add("textbox");
		widgets.add("selectbox");
		widgets.add("passwordbox");
		widgets.add("dialog");
		widgets.add("panel");
		widgets.add("frame");
	}
	
	
	public String toJsSource() throws IOException{
		String jsSource = "";
		Template widget_template = new Template("js/widget");
		widget_template.apply("ID", name);
		String Type = type.substring(0, 1).toUpperCase() + type.substring(1);//1•¶Žš–Ú‚ð‘å•¶Žš‚É‚µ‚Äon‚ð‚Â‚¯‚é
		widget_template.apply("NAME", Type);
		widget_template.apply("PROPERTIES", JSON.toString(properties));
		
		jsSource += "\t\t\t" + widget_template.source;
		
		for(int i = 0; i < children.size(); i++){
			Template add_child_template = new Template("js/addChildWidget");
			add_child_template.apply("PARENT", name);
			add_child_template.apply("CHILD", children.get(i).name);
			jsSource += "\n" + children.get(i).toJsSource()
				+ "\n\t\t\t" + add_child_template.source;
		}
		
		return jsSource;
		
	}
	
	public String toString() {
		//return type + ":"  + id + events;
		return type + "{"  + "children: " + this.children +  "events: " + this.events + "}";
	}

}
