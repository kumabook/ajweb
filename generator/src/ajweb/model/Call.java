package ajweb.model;

import java.util.ArrayList;

public class Call implements Expression{
	public String func;
	public String element;
	public ArrayList<Param> params;
	
	@Override
	public String toString() {
	
		return element + "." + func + "(" + params + ")";
	}
}
