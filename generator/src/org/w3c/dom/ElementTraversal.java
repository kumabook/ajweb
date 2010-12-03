package org.w3c.dom;

public abstract interface ElementTraversal {
	  public abstract org.w3c.dom.Element getFirstElementChild();
	  
	  public abstract org.w3c.dom.Element getLastElementChild();
	  
	  public abstract org.w3c.dom.Element getNextElementSibling();
	  
	  public abstract org.w3c.dom.Element getPreviousElementSibling();

	  public abstract int getChildElementCount();
}
